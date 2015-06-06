// Copyright 2015 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('axs.color');
goog.provide('axs.color.Color');

/**
 * @constructor
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} alpha
 */
axs.color.Color = function(red, green, blue, alpha) {
    /** @type {number} */
    this.red = red;

    /** @type {number} */
    this.green = green;

    /** @type {number} */
    this.blue = blue;

    /** @type {number} */
    this.alpha = alpha;
};

/**
 * Calculate the contrast ratio between the two given colors. Returns the ratio
 * to 1, for example for two two colors with a contrast ratio of 21:1, this
 * function will return 21.
 * @param {axs.color.Color} fgColor
 * @param {axs.color.Color} bgColor
 * @return {!number}
 */
axs.color.calculateContrastRatio = function(fgColor, bgColor) {
    if (fgColor.alpha < 1)
        fgColor = axs.color.flattenColors(fgColor, bgColor);

    var fgLuminance = axs.color.calculateLuminance(fgColor);
    var bgLuminance = axs.color.calculateLuminance(bgColor);
    var contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
        (Math.min(fgLuminance, bgLuminance) + 0.05);
    return contrastRatio;
};

/**
 * Calculate the luminance of the given color using the WCAG algorithm.
 * @param {axs.color.Color} color
 * @return {number}
 */
axs.color.calculateLuminance = function(color) {
/*    var rSRGB = color.red / 255;
    var gSRGB = color.green / 255;
    var bSRGB = color.blue / 255;

    var r = rSRGB <= 0.03928 ? rSRGB / 12.92 : Math.pow(((rSRGB + 0.055)/1.055), 2.4);
    var g = gSRGB <= 0.03928 ? gSRGB / 12.92 : Math.pow(((gSRGB + 0.055)/1.055), 2.4);
    var b = bSRGB <= 0.03928 ? bSRGB / 12.92 : Math.pow(((bSRGB + 0.055)/1.055), 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b; */
    var ycc = axs.color.toYCC(color);
    return ycc[0];
};

/**
 * Compute the luminance ratio between two luminance values.
 * @param {number} luminance1
 * @param {number} luminance2
 */
axs.color.luminanceRatio = function(luminance1, luminance2) {
    return (Math.max(luminance1, luminance2) + 0.05) /
        (Math.min(luminance1, luminance2) + 0.05);
};

/**
 * @param {string} colorString The color string from CSS.
 * @return {?axs.color.Color}
 */
axs.color.parseColor = function(colorString) {
    var rgbRegex = /^rgb\((\d+), (\d+), (\d+)\)$/;
    var match = colorString.match(rgbRegex);

    if (match) {
        var r = parseInt(match[1], 10);
        var g = parseInt(match[2], 10);
        var b = parseInt(match[3], 10);
        var a = 1;
        return new axs.color.Color(r, g, b, a);
    }

    var rgbaRegex = /^rgba\((\d+), (\d+), (\d+), (\d*(\.\d+)?)\)/;
    match = colorString.match(rgbaRegex);
    if (match) {
        var r = parseInt(match[1], 10);
        var g = parseInt(match[2], 10);
        var b = parseInt(match[3], 10);
        var a = parseFloat(match[4]);
        return new axs.color.Color(r, g, b, a);
    }

    return null;
};

/**
 * @param {number} value The value of a color channel, 0 <= value <= 0xFF
 * @return {!string}
 */
axs.color.colorChannelToString = function(value) {
    value = Math.round(value);
    if (value <= 0xF)
        return '0' + value.toString(16);
    return value.toString(16);
};

/**
 * @param {axs.color.Color} color
 * @return {!string}
 */
axs.color.colorToString = function(color) {
    if (color.alpha == 1) {
         return '#' + axs.color.colorChannelToString(color.red) +
         axs.color.colorChannelToString(color.green) + axs.color.colorChannelToString(color.blue);
    }
    else
        return 'rgba(' + [color.red, color.green, color.blue, color.alpha].join(',') + ')';
};

/**
 * Compute a desired luminance given a given luminance and a desired contrast ratio.
 * @param {number} luminance The given luminance.
 * @param {number} contrast The desired contrast ratio.
 * @param {boolean} higher Whether the desired luminance is higher or lower than the given luminance.
 * @return {number} The desired luminance.
 */
axs.color.luminanceFromContrastRatio = function(luminance, contrast, higher) {
    if (higher) {
        var newLuminance = (luminance + 0.05) * contrast - 0.05;
        return newLuminance;
    } else {
        var newLuminance = (luminance + 0.05) / contrast - 0.05;
        return newLuminance;
    }
};

/**
 * Given a color in YCC format and a desired luminance, pick a new color with the desired luminance which is
 * a translation towards black or white of the old color.
 * @param {Array.<number>} ycc A color in YCC as an array with three elements.
 * @param {number} luminance The desired luminance
 * @return {axs.color.Color} A new color in RGB.
 */
axs.color.translateColor = function(ycc, luminance) {
    var oldLuminance = ycc[0];
    if (oldLuminance > luminance)
        var endpoint = 0;
    else
        var endpoint = 1;

    var d = luminance - oldLuminance;
    var scale = 0; // d / (endpoint - oldLuminance);

    /** @type {Array.<number>} */ var translatedColor = [ luminance,
                                                          ycc[1] - ycc[1] * scale,
                                                          ycc[2] - ycc[2] * scale ];
    var rgb = axs.color.fromYCC(translatedColor);
    return rgb;
};

/** @typedef {{fg: string, bg: string, contrast: string}} */
axs.color.SuggestedColors;

/**
 * @param {axs.color.Color} bgColor
 * @param {axs.color.Color} fgColor
 * @param {Object.<string, number>} desiredContrastRatios A map of label to desired contrast ratio.
 * @return {Object.<string, axs.color.SuggestedColors>}
 */
axs.color.suggestColors = function(bgColor, fgColor, desiredContrastRatios) {
    var colors = {};
    var bgLuminance = axs.color.calculateLuminance(bgColor);
    var fgLuminance = axs.color.calculateLuminance(fgColor);

    var fgLuminanceIsHigher = fgLuminance > bgLuminance;
    var fgYCC = axs.color.toYCC(fgColor);
    var bgYCC = axs.color.toYCC(bgColor);
    for (var desiredLabel in desiredContrastRatios) {
        var desiredContrast = desiredContrastRatios[desiredLabel];

        var desiredFgLuminance = axs.color.luminanceFromContrastRatio(bgLuminance, desiredContrast + 0.02, fgLuminanceIsHigher);
        if (desiredFgLuminance <= 1 && desiredFgLuminance >= 0) {
            var newFgColor = axs.color.translateColor(fgYCC, desiredFgLuminance);
            var newContrastRatio = axs.color.calculateContrastRatio(newFgColor, bgColor);
            var suggestedColors = {};
            suggestedColors.fg = /** @type {!string} */ (axs.color.colorToString(newFgColor));
            suggestedColors.bg = /** @type {!string} */ (axs.color.colorToString(bgColor));
            suggestedColors.contrast = /** @type {!string} */ (newContrastRatio.toFixed(2));
            colors[desiredLabel] = /** @type {axs.color.SuggestedColors} */ (suggestedColors);
            continue;
        }

        var desiredBgLuminance = axs.color.luminanceFromContrastRatio(fgLuminance, desiredContrast + 0.02, !fgLuminanceIsHigher);
        if (desiredBgLuminance <= 1 && desiredBgLuminance >= 0) {
            var newBgColor = axs.color.translateColor(bgYCC, desiredBgLuminance);
            var newContrastRatio = axs.color.calculateContrastRatio(fgColor, newBgColor);
            var suggestedColors = {};
            suggestedColors.bg = /** @type {!string} */ (axs.color.colorToString(newBgColor));
            suggestedColors.fg = /** @type {!string} */ (axs.color.colorToString(fgColor));
            suggestedColors.contrast = /** @type {!string} */ (newContrastRatio.toFixed(2));
            colors[desiredLabel] = /** @type {axs.color.SuggestedColors} */ (suggestedColors);
        }
    }
    return colors;
};

/**
 * Combine the two given color according to alpha blending.
 * @param {axs.color.Color} fgColor
 * @param {axs.color.Color} bgColor
 * @return {axs.color.Color}
 */
axs.color.flattenColors = function(fgColor, bgColor) {
    var alpha = fgColor.alpha;
    var r = ((1 - alpha) * bgColor.red) + (alpha * fgColor.red);
    var g = ((1 - alpha) * bgColor.green) + (alpha * fgColor.green);
    var b = ((1 - alpha) * bgColor.blue) + (alpha * fgColor.blue);
    var a = fgColor.alpha + (bgColor.alpha * (1 - fgColor.alpha));

    return new axs.color.Color(r, g, b, a);
};

/**
 * Multiply the given color vector by the given transformation matrix.
 * @param {Array.<Array.<number>>} matrix A 3x3 conversion matrix
 * @param {Array.<number>} vector A 3-element color vector
 * @return {Array.<number>} A 3-element color vector
 */
axs.color.convertColor = function(matrix, vector) {
    var a = matrix[0][0];
    var b = matrix[0][1];
    var c = matrix[0][2];
    var d = matrix[1][0];
    var e = matrix[1][1];
    var f = matrix[1][2];
    var g = matrix[2][0];
    var h = matrix[2][1];
    var k = matrix[2][2];

    var x = vector[0];
    var y = vector[1];
    var z = vector[2];

    return [
        a*x + b*y + c*z,
        d*x + e*y + f*z,
        g*x + h*y + k*z
    ];
};

/**
 * Convert a given RGB color to YCC.
 * @param {axs.color.Color} color
 */
axs.color.toYCC = function(color) {
    var rSRGB = color.red / 255;
    var gSRGB = color.green / 255;
    var bSRGB = color.blue / 255;

    var r = rSRGB <= 0.03928 ? rSRGB / 12.92 : Math.pow(((rSRGB + 0.055)/1.055), 2.4);
    var g = gSRGB <= 0.03928 ? gSRGB / 12.92 : Math.pow(((gSRGB + 0.055)/1.055), 2.4);
    var b = bSRGB <= 0.03928 ? bSRGB / 12.92 : Math.pow(((bSRGB + 0.055)/1.055), 2.4);

    return axs.color.convertColor(axs.color.YCC_MATRIX, [r, g, b]);
};

/**
 * Convert a color from a YCC color (as a vector) to an RGB color
 * @param {Array.<number>} yccColor
 * @return {axs.color.Color}
 */
axs.color.fromYCC = function(yccColor) {
    var rgb = axs.color.convertColor(axs.color.INVERTED_YCC_MATRIX, yccColor);

    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    var rSRGB = r <= 0.00303949 ? (r * 12.92) : (Math.pow(r, (1/2.4)) * 1.055) - 0.055;
    var gSRGB = g <= 0.00303949 ? (g * 12.92) : (Math.pow(g, (1/2.4)) * 1.055) - 0.055;
    var bSRGB = b <= 0.00303949 ? (b * 12.92) : (Math.pow(b, (1/2.4)) * 1.055) - 0.055;

    var red = Math.min(Math.max(Math.round(rSRGB * 255), 0), 255);
    var green = Math.min(Math.max(Math.round(gSRGB * 255), 0), 255);
    var blue = Math.min(Math.max(Math.round(bSRGB * 255), 0), 255);

    return new axs.color.Color(red, green, blue, 1);
};

/**
 * Returns an RGB to YCC conversion matrix for the given kR, kB constants.
 * @param {number} kR
 * @param {number} kB
 * @return {Array.<Array.<number>>}
 */
axs.color.RGBToYCCMatrix = function(kR, kB) {
    return [
        [
            kR,
            (1 - kR - kB),
            kB
        ],
        [
            -kR/(2 - 2*kB),
            (kR + kB - 1)/(2 - 2*kB),
            (1 - kB)/(2 - 2*kB)
        ],
        [
            (1 - kR)/(2 - 2*kR),
            (kR + kB - 1)/(2 - 2*kR),
            -kB/(2 - 2*kR)
        ]
    ];
};

/**
 * Return the inverse of the given 3x3 matrix.
 * @param {Array.<Array.<number>>} matrix
 * @return Array.<Array.<number>> The inverse of the given matrix.
 */
axs.color.invert3x3Matrix = function(matrix) {
    var a = matrix[0][0];
    var b = matrix[0][1];
    var c = matrix[0][2];
    var d = matrix[1][0];
    var e = matrix[1][1];
    var f = matrix[1][2];
    var g = matrix[2][0];
    var h = matrix[2][1];
    var k = matrix[2][2];

    var A = (e*k - f*h);
    var B = (f*g - d*k);
    var C = (d*h - e*g);
    var D = (c*h - b*k);
    var E = (a*k - c*g);
    var F = (g*b - a*h);
    var G = (b*f - c*e);
    var H = (c*d - a*f);
    var K = (a*e - b*d);

    var det = a * (e*k - f*h) - b * (k*d - f*g) + c * (d*h - e*g);
    var z = 1/det;

    return axs.color.scalarMultiplyMatrix([
        [ A, D, G ],
        [ B, E, H ],
        [ C, F, K ]
    ], z);
};

/**
 * Multiply a matrix by a scalar.
 * @param {Array.<Array.<number>>} matrix A 3x3 matrix.
 * @param {number} scalar
 * @return {Array.<Array.<number>>}
 */
axs.color.scalarMultiplyMatrix = function(matrix, scalar) {
    var result = [];
    result[0] = [];
    result[1] = [];
    result[2] = [];

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            result[i][j] = matrix[i][j] * scalar;
        }
    }

    return result;
};

axs.color.kR = 0.2126;
axs.color.kB = 0.0722;
axs.color.YCC_MATRIX = axs.color.RGBToYCCMatrix(axs.color.kR, axs.color.kB);
axs.color.INVERTED_YCC_MATRIX = axs.color.invert3x3Matrix(axs.color.YCC_MATRIX);
