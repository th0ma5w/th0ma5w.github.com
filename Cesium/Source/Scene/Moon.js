/*global define*/
define([
        '../Core/buildModuleUrl',
        '../Core/Cartesian3',
        '../Core/defaultValue',
        '../Core/defined',
        '../Core/destroyObject',
        '../Core/Ellipsoid',
        '../Core/IauOrientationAxes',
        '../Core/Matrix3',
        '../Core/Matrix4',
        '../Core/Simon1994PlanetaryPositions',
        '../Core/Transforms',
        './EllipsoidPrimitive',
        './Material'
    ], function(
        buildModuleUrl,
        Cartesian3,
        defaultValue,
        defined,
        destroyObject,
        Ellipsoid,
        IauOrientationAxes,
        Matrix3,
        Matrix4,
        Simon1994PlanetaryPositions,
        Transforms,
        EllipsoidPrimitive,
        Material) {
    "use strict";

    /**
     * Draws the Moon in 3D.
     * @alias Moon
     * @constructor
     *
     * @param {Boolean} [options.show=true] Determines whether the moon will be rendered.
     * @param {String} [options.textureUrl=buildModuleUrl('Assets/Textures/moonSmall.jpg')] The moon texture.
     * @param {Ellipsoid} [options.ellipsoid=Ellipsoid.MOON] The moon ellipsoid.
     * @param {Boolean} [options.onlySunLighting=true] Use the sun as the only light source.
     *
     * @example
     * scene.moon = new Cesium.Moon();
     */
    var Moon = function(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        var url = options.textureUrl;
        if (!defined(url)) {
            url = buildModuleUrl('Assets/Textures/moonSmall.jpg');
        }

        /**
         * Determines if the moon will be shown.
         *
         * @type {Boolean}
         * @default true
         */
        this.show = defaultValue(options.show, true);

        /**
         * The moon texture.
         * @type {String}
         * @default buildModuleUrl('Assets/Textures/moonSmall.jpg')
         */
        this.textureUrl = url;

        /**
         * The moon ellipsoid.
         * @type {Ellipsoid}
         * @default Ellipsoid.MOON
         */
        this.ellipsoid = defaultValue(options.ellipsoid, Ellipsoid.MOON);

        /**
         * Use the sun as the only light source.
         * @type {Boolean}
         * @default true
         */
        this.onlySunLighting = defaultValue(options.onlySunLighting, true);

        this._ellipsoidPrimitive = new EllipsoidPrimitive({
            radii : this.ellipsoid.radii,
            material : Material.fromType(Material.ImageType),
            onlySunLighting : this.onlySunLighting,
            _owner : this
        });

        this._axes = new IauOrientationAxes();
    };

    var icrfToFixed = new Matrix3();
    var rotationScratch = new Matrix3();
    var translationScratch = new Cartesian3();

    Moon.prototype.update = function(context, frameState, commandList) {
        if (!this.show) {
            return;
        }

        var ellipsoidPrimitive = this._ellipsoidPrimitive;
        ellipsoidPrimitive.material.uniforms.image = this.textureUrl;
        ellipsoidPrimitive.onlySunLighting = this.onlySunLighting;

        var date = frameState.time;
        if (!defined(Transforms.computeIcrfToFixedMatrix(date, icrfToFixed))) {
            Transforms.computeTemeToPseudoFixedMatrix(date, icrfToFixed);
        }

        var rotation = this._axes.evaluate(date, rotationScratch);
        Matrix3.transpose(rotation, rotation);
        Matrix3.multiply(icrfToFixed, rotation, rotation);

        var translation = Simon1994PlanetaryPositions.ComputeMoonPositionInEarthInertialFrame(date, translationScratch);
        Matrix3.multiplyByVector(icrfToFixed, translation, translation);

        Matrix4.fromRotationTranslation(rotation, translation, ellipsoidPrimitive.modelMatrix);
        ellipsoidPrimitive.update(context, frameState, commandList);
    };

    /**
     * Returns true if this object was destroyed; otherwise, false.
     * <br /><br />
     * If this object was destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
     *
     * @memberof Moon
     *
     * @returns {Boolean} <code>true</code> if this object was destroyed; otherwise, <code>false</code>.
     *
     * @see Moon#destroy
     */
    Moon.prototype.isDestroyed = function() {
        return false;
    };

    /**
     * Destroys the WebGL resources held by this object.  Destroying an object allows for deterministic
     * release of WebGL resources, instead of relying on the garbage collector to destroy this object.
     * <br /><br />
     * Once an object is destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.  Therefore,
     * assign the return value (<code>undefined</code>) to the object as done in the example.
     *
     * @memberof Moon
     *
     * @returns {undefined}
     *
     * @exception {DeveloperError} This object was destroyed, i.e., destroy() was called.
     *
     * @see Moon#isDestroyed
     *
     * @example
     * moon = moon && moon.destroy();
     */
    Moon.prototype.destroy = function() {
        this._ellipsoid = this._ellipsoid && this._ellipsoid.destroy();
        return destroyObject(this);
    };

    return Moon;
});