
/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/


/**
 * AUTO-GENERATED FILE. DO NOT MODIFY.
 */

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
import { __extends } from "tslib";
import SeriesModel from '../../model/Series.js';
import createSeriesData from '../helper/createSeriesData.js';
import { each } from 'zrender/lib/core/util.js';

var BaseBarSeriesModel =
/** @class */
function (_super) {
  __extends(BaseBarSeriesModel, _super);

  function BaseBarSeriesModel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.type = BaseBarSeriesModel.type;
    return _this;
  }

  BaseBarSeriesModel.prototype.getInitialData = function (option, ecModel) {
    return createSeriesData(null, this, {
      useEncodeDefaulter: true
    });
  };

  BaseBarSeriesModel.prototype.getMarkerPosition = function (value, dims, startingAtTick) {
    var coordSys = this.coordinateSystem;

    if (coordSys && coordSys.clampData) {
      // PENDING if clamp ?
      var pt_1 = coordSys.dataToPoint(coordSys.clampData(value));

      if (startingAtTick) {
        each(coordSys.getAxes(), function (axis, idx) {
          // If axis type is category, use tick coords instead
          if (axis.type === 'category') {
            var tickCoords = axis.getTicksCoords();
            var tickIdx = coordSys.clampData(value)[idx]; // The index of rightmost tick of markArea is 1 larger than x1/y1 index

            if (dims && (dims[idx] === 'x1' || dims[idx] === 'y1')) {
              tickIdx += 1;
            }

            tickIdx > tickCoords.length - 1 && (tickIdx = tickCoords.length - 1);
            tickIdx < 0 && (tickIdx = 0);
            tickCoords[tickIdx] && (pt_1[idx] = axis.toGlobalCoord(tickCoords[tickIdx].coord));
          }
        });
      } else {
        var data = this.getData();
        var offset = data.getLayout('offset');
        var size = data.getLayout('size');
        var offsetIndex = coordSys.getBaseAxis().isHorizontal() ? 0 : 1;
        pt_1[offsetIndex] += offset + size / 2;
      }

      return pt_1;
    }

    return [NaN, NaN];
  };

  BaseBarSeriesModel.type = 'series.__base_bar__';
  BaseBarSeriesModel.defaultOption = {
    // zlevel: 0,
    z: 2,
    coordinateSystem: 'cartesian2d',
    legendHoverLink: true,
    // stack: null
    // Cartesian coordinate system
    // xAxisIndex: 0,
    // yAxisIndex: 0,
    barMinHeight: 0,
    barMinAngle: 0,
    // cursor: null,
    large: false,
    largeThreshold: 400,
    progressive: 3e3,
    progressiveChunkMode: 'mod'
  };
  return BaseBarSeriesModel;
}(SeriesModel);

SeriesModel.registerClass(BaseBarSeriesModel);
export default BaseBarSeriesModel;