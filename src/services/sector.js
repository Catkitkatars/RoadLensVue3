import L from 'leaflet';

(function () {
    var DEG_TO_RAD = Math.PI / 180;

    function rendererAngle(angle) { // degrees, clockwise from North
        return (angle + 90) * DEG_TO_RAD; // radians, clockwise from x-axis
    }

    // rotate point [x + r, y + r] around [x, y] by <angle> radians
    function rotate(p, angle, r) {
        return p.add(new L.Point(Math.cos(angle), Math.sin(angle))._multiplyBy(r));
    }

    L.Circle.mergeOptions({
        // pragmatic assumption: startAngle <= endAngle
        startAngle: 0,
        endAngle: 360,
    });

    L.Circle.addInitHook(function () {
        this._startAngle = rendererAngle(this.options.startAngle);
        this._endAngle = rendererAngle(this.options.endAngle);
    });

    L.Circle.include({
        /* public methods */

        getEndAngleCoords: function () {
            return L.CRS.Earth.destination(this._latlng, this.options.endAngle, this._mRadius);
        },

        getStartAngleCoords: function () {
            return L.CRS.Earth.destination(this._latlng, this.options.startAngle, this._mRadius);
        },

        getMiddleAngleCoords: function () {
            return L.CRS.Earth.destination(this._latlng, this.options.direction, this._mRadius);
        },

        getBounds: function () { // cf. L.Circle.getBounds
            var c = this._latlng,
                s = this.options.startAngle,
                e = this.options.endAngle,
                r = this._mRadius,
                earth = L.CRS.Earth,
                bounds = new L.LatLngBounds([c]);

            [s, s + 90, s + 180, s + 270, e].forEach(function (bearing) {
                if (s <= bearing && bearing <= e) {
                    bounds.extend(earth.destination(c, bearing, r));
                }
            });
            return bounds;
        },

        setDirection: function (pointCoords) {
            var centerLatLng = this._latlng;

            var direction = Math.round(L.CRS.Earth.bearing(pointCoords, centerLatLng));

            this.setSector(direction, this.options.angle);
        },

        setLength: function (pointCoords) {
            var centerLatLng = this._latlng;

            var newRadius = Math.round(centerLatLng.distanceTo(pointCoords));

            this.setRadius(newRadius);
            this.options.radius = this._mRadius
        },
        setWidth: function (newEndAngleCoords) {
            // Получаем текущие координаты угла start
            var currentStartLatLng = this.getStartAngleCoords();

            // Вычисляем угол между текущим и новым углом start
            var bearingChange = L.CRS.Earth.bearing(newEndAngleCoords, this._latlng) - L.CRS.Earth.bearing(currentStartLatLng, this._latlng);

            // Рассчитываем новые углы с учетом периодичности
            var newStartAngle = Math.round((this.options.startAngle + bearingChange) % 360);
            var newEndAngle = Math.round((this.options.endAngle - bearingChange) % 360);

            // Обрабатываем отрицательные значения
            if (newStartAngle < 0) {
                newStartAngle += 360;
            }
            if (newEndAngle < 0) {
                newEndAngle += 360;
            }
            var widthAngle = (newEndAngle - newStartAngle + 360) % 360;

            if (widthAngle >= 5 && widthAngle <= 120) {
                this.setAngles(newStartAngle, newEndAngle);
                this.options.angle = widthAngle;
            }
        },

        /* additional public methods */

        contains: function (latLng) {
            latLng = L.latLng(latLng);
            var bearing = L.CRS.Earth.bearing(this._latlng, latLng);

            return this.options.startAngle <= bearing &&
                bearing <= this.options.endAngle &&
                L.CRS.Earth.distance(this._latlng, latLng) <= this._mRadius;
        },

        setAngles: function (start, end) {
            if (typeof start === 'number') {
                this.options.startAngle = start;
                this._startAngle = rendererAngle(start);
            }
            if (typeof end === 'number') {
                this.options.endAngle = end;
                this._endAngle = rendererAngle(end);
            }

            return this.redraw();
        },

        setSector: function (direction, centralAngle) {
            this.options.direction = direction;
            this.options.angle = centralAngle;
            this.options.radius = this.getRadius();

            var halfAngle = centralAngle / 2;
            var startAngle = direction - halfAngle;
            var endAngle = direction + halfAngle;

            if (startAngle < 0) {
                startAngle += 360;
            } else if (startAngle >= 360) {
                startAngle -= 360;
            }
            if (endAngle < 0) {
                endAngle += 360;
            } else if (endAngle >= 360) {
                endAngle -= 360;
            }

            return this.setAngles(startAngle, endAngle);
        },

        /* private methods */

        _project: function () { // edited L.Circle._project
            var lng = this._latlng.lng,
                lat = this._latlng.lat,
                map = this._map,
                crs = map.options.crs;

            if (crs.distance === L.CRS.Earth.distance) {
                var d = Math.PI / 180,
                    latR = (this._mRadius / L.CRS.Earth.R) / d,
                    top = map.project([lat + latR, lng]),
                    bottom = map.project([lat - latR, lng]),
                    p = top.add(bottom).divideBy(2),
                    lat2 = map.unproject(p).lat,
                    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
                        (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

                if (isNaN(lngR) || lngR === 0) {
                    lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
                }

                this._radius = isNaN(lngR) ? 0 : Math.max(Math.round(p.x - map.project([lat2, lng - lngR]).x), 1);
                this._radiusY = Math.max(Math.round(p.y - top.y), 1);

            } else {
                var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

                this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
            }

            this._point = map.latLngToLayerPoint(this._latlng);
            this._updateBounds();
        },

        _updatePath: function () { // edited L.CircleMarker._updatePath
            if (this.options.endAngle - this.options.startAngle < 360) {
                this._renderer._updateCircleSector(this);
            } else {
                this._renderer._updateCircle(this);
            }
        }
    });

    /* Renderer helper methods */

    L.Canvas.include({
        _updateCircleSector: function (layer) {
            // cf. L.Canvas._updateCircle
            if (layer._empty()) { return; }

            var p = layer._point,
                ctx = this._ctx,
                r = layer._radius,
                s = (layer._radiusY || r) / r,
                start = rotate(p, layer._startAngle, r);

            this._drawnLayers[layer._leaflet_id] = layer;

            if (s !== 1) {
                ctx.save();
                ctx.scale(1, s);
            }

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(start.x, start.y);
            ctx.arc(p.x, p.y, r, layer._startAngle, layer._endAngle);
            ctx.lineTo(p.x, p.y);

            if (s !== 1) {
                ctx.restore();
            }

            this._fillStroke(ctx, layer);
        }
    });

    L.SVG.include({
        _updateCircleSector: function (layer) {
            // cf. L.SVG._updateCircle
            var c = layer._point,
                r = layer._radius,
                r2 = Math.round(layer._radiusY || r),
                s = rotate(c, layer._startAngle, r),
                e = rotate(c, layer._endAngle, r);

            var d = layer._empty() ? 'M0 0' : [
                'M', c.x, c.y,
                'L', s.x, s.y,
                'A', r, r2, '0',
                (layer.options.endAngle - layer.options.startAngle >= 180) ? '1' : '0', // large-arc-flag
                '1', // sweep-flag
                e.x, e.y,
                'z',
            ].join(' ');

            this._setPath(layer, d);
        }
    });

    /* CRS helper methods */

    L.CRS.Earth.bearing = function (latLng1, latLng2) { // true LatLng's
        // http://www.movable-type.co.uk/scripts/latlong.html#bearing
        var lat1 = latLng1.lat * DEG_TO_RAD,
            lng1 = latLng1.lng * DEG_TO_RAD,
            lat2 = latLng2.lat * DEG_TO_RAD,
            lng2 = latLng2.lng * DEG_TO_RAD,
            x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1),
            y = Math.sin(lng2 - lng1) * Math.cos(lat2);

        return ((Math.atan2(y, x) / DEG_TO_RAD) + 360) % 360; // normalized to 0-360
    };

    L.CRS.Earth.destination = function (latLng, bearing, distance) { // true LatLng
        // http://www.movable-type.co.uk/scripts/latlong.html#destPoint
        bearing = (bearing + 180) % 360; // Adjusting bearing according to the requested orientation
        bearing *= DEG_TO_RAD;
        var lat1 = latLng.lat * DEG_TO_RAD,
            lng1 = latLng.lng * DEG_TO_RAD,
            sin_lat1 = Math.sin(lat1),
            cos_lat1 = Math.cos(lat1),
            dR = distance / this.R,
            sin_dR = Math.sin(dR),
            cos_dR = Math.cos(dR),
            lat2 = Math.asin(sin_lat1 * cos_dR + cos_lat1 * sin_dR * Math.cos(bearing)),
            lng2 = lng1 + Math.atan2(Math.sin(bearing) * sin_dR * cos_lat1, cos_dR - sin_lat1 * Math.sin(lat2));

        return new L.LatLng(lat2 / DEG_TO_RAD,
            ((lng2 / DEG_TO_RAD) + 540) % 360 - 180); // normalized to -180 - 180
    };
})();
