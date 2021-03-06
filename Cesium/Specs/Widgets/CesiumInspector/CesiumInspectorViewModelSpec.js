/*global defineSuite*/
defineSuite([
         'Widgets/CesiumInspector/CesiumInspectorViewModel',
         'Specs/createScene',
         'Specs/destroyScene',
         'Core/Extent',
         'Core/defined',
         'Scene/ExtentPrimitive',
         'Scene/Tile',
         'Scene/WebMercatorTilingScheme',
         'Scene/Material',
         'Scene/CentralBody',
         'Core/Math'
     ], function(
         CesiumInspectorViewModel,
         createScene,
         destroyScene,
         Extent,
         defined,
         ExtentPrimitive,
         Tile,
         WebMercatorTilingScheme,
         Material,
         CentralBody,
         CesiumMath) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn,runs,waits,waitsFor*/

    var scene;
    beforeAll(function() {
        scene = createScene();
    });

    afterAll(function() {
        destroyScene(scene);
    });

    beforeEach(function() {
        scene.primitives.centralBody = new CentralBody();
        scene.initializeFrame();
    });

    afterEach(function() {
        scene.primitives.removeAll();
    });

    it('constructor sets values', function() {
        var viewModel = new CesiumInspectorViewModel(scene);
        expect(viewModel.scene).toBe(scene);
    });

    it('throws if scene is undefined', function() {
        expect(function() {
            return new CesiumInspectorViewModel();
        }).toThrow();
    });

    it('show frustums', function() {
        var viewModel = new CesiumInspectorViewModel(scene);
        viewModel.frustums = true;
        viewModel.showFrustums();
        expect(viewModel.scene.debugShowFrustums).toBe(true);
        setTimeout(function(){
            viewModel.frustums = false;
            viewModel.showFrustums();
            expect(viewModel.scene.debugShowFrustums).toBe(false);
        }, 250);
    });

    it('show performance', function() {
        var viewModel = new CesiumInspectorViewModel(scene);
        viewModel.performance = true;
        viewModel.showPerformance();
        scene.render();
        var elements = document.getElementsByClassName('cesium-cesiumInspector-performanceDisplay');
        expect(elements[0].innerHTML).not.toEqual('');

        viewModel.performance = false;
        viewModel.showPerformance();
        scene.render();
        expect(elements[0].innerHTML).toEqual('');
    });

    it ('primitive bounding sphere', function() {
        var p = scene.primitives.add(new ExtentPrimitive({
            extent : new Extent(
                    CesiumMath.toRadians(-110.0),
                    CesiumMath.toRadians(0.0),
                    CesiumMath.toRadians(-90.0),
                    CesiumMath.toRadians(20.0)),
                rotation : CesiumMath.toRadians(45),
                material : Material.fromType(Material.ColorType)
            })
        );
        var viewModel = new CesiumInspectorViewModel(scene);
        scene.render();
        viewModel.primitive = p;
        viewModel.primitiveBoundingSphere = true;
        viewModel.showPrimitiveBoundingSphere();
        expect(p.debugShowBoundingVolume).toEqual(true);

        viewModel.primitiveBoundingSphere = false;
        viewModel.showPrimitiveBoundingSphere();
        scene.render();
        expect(p.debugShowBoundingVolume).toEqual(false);
    });

    it ('primitive filter', function() {
        var p = scene.primitives.add(new ExtentPrimitive({
            extent : new Extent(
                    CesiumMath.toRadians(-110.0),
                    CesiumMath.toRadians(0.0),
                    CesiumMath.toRadians(-90.0),
                    CesiumMath.toRadians(20.0)),
                rotation : CesiumMath.toRadians(45),
                material : Material.fromType(Material.ColorType)
            })
        );

        var q = scene.primitives.add(new ExtentPrimitive({
            extent : new Extent(
                    CesiumMath.toRadians(-10.0),
                    CesiumMath.toRadians(0.0),
                    CesiumMath.toRadians(-9.0),
                    CesiumMath.toRadians(20.0)),
                material : Material.fromType(Material.ColorType)
            })
        );

        var viewModel = new CesiumInspectorViewModel(scene);
        scene.render();
        viewModel.primitive = p;
        viewModel.filterPrimitive = true;
        viewModel.doFilterPrimitive();
        expect(defined(scene.debugCommandFilter)).toEqual(true);
        expect(scene.debugCommandFilter({owner: p})).toEqual(true);
        expect(scene.debugCommandFilter({owner: q})).toEqual(false);

        viewModel.filterPrimitive = false;
        viewModel.doFilterPrimitive();
        expect(defined(scene.debugCommandFilter)).toEqual(false);
    });

    it ('primitive reference frame', function() {
        var p = scene.primitives.add(new ExtentPrimitive({
            extent : new Extent(
                    CesiumMath.toRadians(-110.0),
                    CesiumMath.toRadians(0.0),
                    CesiumMath.toRadians(-90.0),
                    CesiumMath.toRadians(20.0)),
                rotation : CesiumMath.toRadians(45),
                material : Material.fromType(Material.ColorType)
            })
        );
        var viewModel = new CesiumInspectorViewModel(scene);
        scene.render();
        viewModel.primitive = p;
        viewModel.primitiveReferenceFrame = true;
        viewModel.showPrimitiveReferenceFrame();
        expect(scene.primitives.length).toEqual(2);

        viewModel.primitiveReferenceFrame = false;
        viewModel.showPrimitiveReferenceFrame();
        scene.render();
        expect(scene.primitives.length).toEqual(1);
    });

    it('show wireframe', function() {
        var viewModel = new CesiumInspectorViewModel(scene);
        viewModel.wireframe = true;
        viewModel.showWireframe();
        expect(viewModel.scene.primitives.centralBody._surface._debug.wireframe).toBe(true);

        viewModel.wireframe = false;
        viewModel.showWireframe();
        expect(viewModel.scene.primitives.centralBody._surface._debug.wireframe).toBe(false);
    });

    it('suspend updates', function() {
        var viewModel = new CesiumInspectorViewModel(scene);
        viewModel.suspendUpdates = true;
        viewModel.doSuspendUpdates();
        expect(viewModel.scene.primitives.centralBody._surface._debug.suspendLodUpdate).toBe(true);

        viewModel.suspendUpdates = false;
        viewModel.doSuspendUpdates();
        expect(viewModel.scene.primitives.centralBody._surface._debug.suspendLodUpdate).toBe(false);
    });

    it('show tile coords', function() {
        var viewModel = new CesiumInspectorViewModel(scene);
        expect(viewModel.scene.primitives.centralBody.imageryLayers.length).toBe(0);

        viewModel.tileCoordinates  = true;
        viewModel.showTileCoordinates();
        expect(viewModel.scene.primitives.centralBody.imageryLayers.length).toBe(1);

        viewModel.tileCoordinates = false;
        viewModel.showTileCoordinates();
        expect(viewModel.scene.primitives.centralBody.imageryLayers.length).toBe(0);
    });

    it('show tile bounding sphere', function() {
        var viewModel = new CesiumInspectorViewModel(scene);
        var tile = new Tile({tilingScheme : new WebMercatorTilingScheme(), x : 0, y : 0, level : 0});
        viewModel.tile = tile;

        viewModel.tileBoundingSphere  = true;
        viewModel.showTileBoundingSphere();
        expect(viewModel.scene.primitives.centralBody._surface._debug.boundingSphereTile).toBe(tile);

        viewModel.tileBoundingSphere = false;
        viewModel.showTileBoundingSphere();
        expect(viewModel.scene.primitives.centralBody._surface._debug.boundingSphereTile).toBe(undefined);
    });

    it('filter tile', function() {
        var viewModel = new CesiumInspectorViewModel(scene);
        var tile = new Tile({tilingScheme : new WebMercatorTilingScheme(), x : 0, y : 0, level : 0});
        viewModel.tile = tile;

        viewModel.filterTile  = true;
        viewModel.doFilterTile();
        expect(viewModel.scene.primitives.centralBody._surface._tilesToRenderByTextureCount[0][0]).toBe(tile);
        expect(viewModel.suspendUpdates).toBe(true);

        viewModel.filterTile = false;
        viewModel.doFilterTile();
        expect(viewModel.suspendUpdates).toBe(false);
    });

}, 'WebGL');