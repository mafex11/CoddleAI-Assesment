import { WHOReference } from '../types';

/**
 * WHO Growth Standards Reference Data (0-24 months)
 * 
 * This is a simplified subset of WHO growth standards for demonstration.
 * In a production app, you would include the complete WHO LMS data.
 * 
 * Data source: WHO Child Growth Standards
 * https://www.who.int/tools/child-growth-standards/standards
 * 
 * LMS Parameters:
 * L = Lambda (power transformation)
 * M = Mu (median)
 * S = Sigma (coefficient of variation)
 */

export const WHO_GROWTH_DATA: WHOReference = {
  male: {
    weight: [
      // Age in days, L, M (kg), S
      { ageInDays: 0, L: 0.3487, M: 3.3464, S: 0.14602 },
      { ageInDays: 30, L: 0.2581, M: 4.4709, S: 0.13395 },
      { ageInDays: 61, L: 0.1970, M: 5.5675, S: 0.12385 },
      { ageInDays: 91, L: 0.1738, M: 6.3762, S: 0.11727 },
      { ageInDays: 122, L: 0.1553, M: 7.0023, S: 0.11316 },
      { ageInDays: 152, L: 0.1395, M: 7.5105, S: 0.11080 },
      { ageInDays: 183, L: 0.1257, M: 7.9340, S: 0.10958 },
      { ageInDays: 213, L: 0.1134, M: 8.2970, S: 0.10902 },
      { ageInDays: 244, L: 0.1021, M: 8.6151, S: 0.10882 },
      { ageInDays: 274, L: 0.0917, M: 8.9014, S: 0.10881 },
      { ageInDays: 305, L: 0.0820, M: 9.1649, S: 0.10891 },
      { ageInDays: 335, L: 0.0730, M: 9.4122, S: 0.10906 },
      { ageInDays: 365, L: 0.0644, M: 9.6479, S: 0.10925 },
      { ageInDays: 396, L: 0.0563, M: 9.8749, S: 0.10949 },
      { ageInDays: 426, L: 0.0487, M: 10.0953, S: 0.10976 },
      { ageInDays: 457, L: 0.0413, M: 10.3108, S: 0.11007 },
      { ageInDays: 487, L: 0.0343, M: 10.5228, S: 0.11041 },
      { ageInDays: 518, L: 0.0276, M: 10.7319, S: 0.11078 },
      { ageInDays: 548, L: 0.0211, M: 10.9385, S: 0.11117 },
      { ageInDays: 579, L: 0.0148, M: 11.1430, S: 0.11159 },
      { ageInDays: 609, L: 0.0087, M: 11.3462, S: 0.11203 },
      { ageInDays: 640, L: 0.0027, M: 11.5486, S: 0.11250 },
      { ageInDays: 670, L: -0.0031, M: 11.7504, S: 0.11299 },
      { ageInDays: 701, L: -0.0089, M: 11.9514, S: 0.11350 },
      { ageInDays: 731, L: -0.0146, M: 12.1515, S: 0.11404 }
    ],
    height: [
      // Age in days, L, M (cm), S
      { ageInDays: 0, L: 1, M: 49.8842, S: 0.03686 },
      { ageInDays: 30, L: 1, M: 54.7244, S: 0.03557 },
      { ageInDays: 61, L: 1, M: 58.4249, S: 0.03424 },
      { ageInDays: 91, L: 1, M: 61.4292, S: 0.03328 },
      { ageInDays: 122, L: 1, M: 63.8861, S: 0.03257 },
      { ageInDays: 152, L: 1, M: 65.9026, S: 0.03204 },
      { ageInDays: 183, L: 1, M: 67.6236, S: 0.03165 },
      { ageInDays: 213, L: 1, M: 69.1645, S: 0.03139 },
      { ageInDays: 244, L: 1, M: 70.6009, S: 0.03124 },
      { ageInDays: 274, L: 1, M: 71.9687, S: 0.03117 },
      { ageInDays: 305, L: 1, M: 73.2812, S: 0.03117 },
      { ageInDays: 335, L: 1, M: 74.5388, S: 0.03123 },
      { ageInDays: 365, L: 1, M: 75.7488, S: 0.03133 },
      { ageInDays: 396, L: 1, M: 76.9186, S: 0.03147 },
      { ageInDays: 426, L: 1, M: 78.0497, S: 0.03164 },
      { ageInDays: 457, L: 1, M: 79.1458, S: 0.03184 },
      { ageInDays: 487, L: 1, M: 80.2097, S: 0.03207 },
      { ageInDays: 518, L: 1, M: 81.2433, S: 0.03232 },
      { ageInDays: 548, L: 1, M: 82.2487, S: 0.03259 },
      { ageInDays: 579, L: 1, M: 83.2277, S: 0.03289 },
      { ageInDays: 609, L: 1, M: 84.1821, S: 0.03321 },
      { ageInDays: 640, L: 1, M: 85.1133, S: 0.03354 },
      { ageInDays: 670, L: 1, M: 86.0227, S: 0.03390 },
      { ageInDays: 701, L: 1, M: 86.9115, S: 0.03428 },
      { ageInDays: 731, L: 1, M: 87.7815, S: 0.03467 }
    ],
    head: [
      // Age in days, L, M (cm), S
      { ageInDays: 0, L: 1, M: 34.4618, S: 0.03496 },
      { ageInDays: 30, L: 1, M: 37.2759, S: 0.03175 },
      { ageInDays: 61, L: 1, M: 39.1285, S: 0.02953 },
      { ageInDays: 91, L: 1, M: 40.5135, S: 0.02796 },
      { ageInDays: 122, L: 1, M: 41.6317, S: 0.02676 },
      { ageInDays: 152, L: 1, M: 42.5576, S: 0.02581 },
      { ageInDays: 183, L: 1, M: 43.3306, S: 0.02504 },
      { ageInDays: 213, L: 1, M: 43.9803, S: 0.02441 },
      { ageInDays: 244, L: 1, M: 44.5321, S: 0.02387 },
      { ageInDays: 274, L: 1, M: 45.0061, S: 0.02341 },
      { ageInDays: 305, L: 1, M: 45.4182, S: 0.02302 },
      { ageInDays: 335, L: 1, M: 45.7804, S: 0.02268 },
      { ageInDays: 365, L: 1, M: 46.1013, S: 0.02239 },
      { ageInDays: 396, L: 1, M: 46.3876, S: 0.02213 },
      { ageInDays: 426, L: 1, M: 46.6448, S: 0.02190 },
      { ageInDays: 457, L: 1, M: 46.8773, S: 0.02170 },
      { ageInDays: 487, L: 1, M: 47.0888, S: 0.02152 },
      { ageInDays: 518, L: 1, M: 47.2821, S: 0.02135 },
      { ageInDays: 548, L: 1, M: 47.4595, S: 0.02120 },
      { ageInDays: 579, L: 1, M: 47.6230, S: 0.02106 },
      { ageInDays: 609, L: 1, M: 47.7741, S: 0.02094 },
      { ageInDays: 640, L: 1, M: 47.9142, S: 0.02082 },
      { ageInDays: 670, L: 1, M: 48.0448, S: 0.02071 },
      { ageInDays: 701, L: 1, M: 48.1669, S: 0.02061 },
      { ageInDays: 731, L: 1, M: 48.2815, S: 0.02052 }
    ]
  },
  female: {
    weight: [
      // Age in days, L, M (kg), S
      { ageInDays: 0, L: 0.3809, M: 3.2322, S: 0.14171 },
      { ageInDays: 30, L: 0.2986, M: 4.1873, S: 0.13007 },
      { ageInDays: 61, L: 0.2422, M: 5.1282, S: 0.12094 },
      { ageInDays: 91, L: 0.2201, M: 5.8458, S: 0.11608 },
      { ageInDays: 122, L: 0.2024, M: 6.4237, S: 0.11368 },
      { ageInDays: 152, L: 0.1871, M: 6.8985, S: 0.11248 },
      { ageInDays: 183, L: 0.1735, M: 7.2970, S: 0.11187 },
      { ageInDays: 213, L: 0.1612, M: 7.6422, S: 0.11156 },
      { ageInDays: 244, L: 0.1499, M: 7.9487, S: 0.11140 },
      { ageInDays: 274, L: 0.1394, M: 8.2254, S: 0.11132 },
      { ageInDays: 305, L: 0.1295, M: 8.4800, S: 0.11129 },
      { ageInDays: 335, L: 0.1202, M: 8.7192, S: 0.11130 },
      { ageInDays: 365, L: 0.1113, M: 8.9481, S: 0.11135 },
      { ageInDays: 396, L: 0.1028, M: 9.1699, S: 0.11143 },
      { ageInDays: 426, L: 0.0947, M: 9.3868, S: 0.11153 },
      { ageInDays: 457, L: 0.0869, M: 9.6008, S: 0.11165 },
      { ageInDays: 487, L: 0.0794, M: 9.8124, S: 0.11179 },
      { ageInDays: 518, L: 0.0721, M: 10.0226, S: 0.11194 },
      { ageInDays: 548, L: 0.0651, M: 10.2315, S: 0.11211 },
      { ageInDays: 579, L: 0.0582, M: 10.4393, S: 0.11229 },
      { ageInDays: 609, L: 0.0516, M: 10.6464, S: 0.11248 },
      { ageInDays: 640, L: 0.0451, M: 10.8534, S: 0.11268 },
      { ageInDays: 670, L: 0.0387, M: 11.0608, S: 0.11290 },
      { ageInDays: 701, L: 0.0325, M: 11.2691, S: 0.11312 },
      { ageInDays: 731, L: 0.0264, M: 11.4788, S: 0.11336 }
    ],
    height: [
      // Age in days, L, M (cm), S
      { ageInDays: 0, L: 1, M: 49.1477, S: 0.03790 },
      { ageInDays: 30, L: 1, M: 53.6872, S: 0.03640 },
      { ageInDays: 61, L: 1, M: 57.0673, S: 0.03496 },
      { ageInDays: 91, L: 1, M: 59.8029, S: 0.03393 },
      { ageInDays: 122, L: 1, M: 62.0899, S: 0.03321 },
      { ageInDays: 152, L: 1, M: 64.0301, S: 0.03268 },
      { ageInDays: 183, L: 1, M: 65.7311, S: 0.03228 },
      { ageInDays: 213, L: 1, M: 67.2873, S: 0.03199 },
      { ageInDays: 244, L: 1, M: 68.7498, S: 0.03179 },
      { ageInDays: 274, L: 1, M: 70.1435, S: 0.03168 },
      { ageInDays: 305, L: 1, M: 71.4818, S: 0.03163 },
      { ageInDays: 335, L: 1, M: 72.7718, S: 0.03164 },
      { ageInDays: 365, L: 1, M: 74.0157, S: 0.03169 },
      { ageInDays: 396, L: 1, M: 75.2176, S: 0.03178 },
      { ageInDays: 426, L: 1, M: 76.3817, S: 0.03190 },
      { ageInDays: 457, L: 1, M: 77.5099, S: 0.03205 },
      { ageInDays: 487, L: 1, M: 78.6055, S: 0.03223 },
      { ageInDays: 518, L: 1, M: 79.6711, S: 0.03243 },
      { ageInDays: 548, L: 1, M: 80.7079, S: 0.03266 },
      { ageInDays: 579, L: 1, M: 81.7182, S: 0.03291 },
      { ageInDays: 609, L: 1, M: 82.7036, S: 0.03318 },
      { ageInDays: 640, L: 1, M: 83.6654, S: 0.03347 },
      { ageInDays: 670, L: 1, M: 84.6050, S: 0.03378 },
      { ageInDays: 701, L: 1, M: 85.5236, S: 0.03411 },
      { ageInDays: 731, L: 1, M: 86.4227, S: 0.03446 }
    ],
    head: [
      // Age in days, L, M (cm), S
      { ageInDays: 0, L: 1, M: 33.8787, S: 0.03496 },
      { ageInDays: 30, L: 1, M: 36.5463, S: 0.03252 },
      { ageInDays: 61, L: 1, M: 38.2521, S: 0.03073 },
      { ageInDays: 91, L: 1, M: 39.5328, S: 0.02936 },
      { ageInDays: 122, L: 1, M: 40.5574, S: 0.02826 },
      { ageInDays: 152, L: 1, M: 41.4184, S: 0.02735 },
      { ageInDays: 183, L: 1, M: 42.1515, S: 0.02658 },
      { ageInDays: 213, L: 1, M: 42.7846, S: 0.02592 },
      { ageInDays: 244, L: 1, M: 43.3370, S: 0.02533 },
      { ageInDays: 274, L: 1, M: 43.8248, S: 0.02481 },
      { ageInDays: 305, L: 1, M: 44.2606, S: 0.02435 },
      { ageInDays: 335, L: 1, M: 44.6542, S: 0.02394 },
      { ageInDays: 365, L: 1, M: 45.0131, S: 0.02357 },
      { ageInDays: 396, L: 1, M: 45.3431, S: 0.02324 },
      { ageInDays: 426, L: 1, M: 45.6485, S: 0.02294 },
      { ageInDays: 457, L: 1, M: 45.9331, S: 0.02267 },
      { ageInDays: 487, L: 1, M: 46.1998, S: 0.02242 },
      { ageInDays: 518, L: 1, M: 46.4508, S: 0.02219 },
      { ageInDays: 548, L: 1, M: 46.6880, S: 0.02198 },
      { ageInDays: 579, L: 1, M: 46.9131, S: 0.02178 },
      { ageInDays: 609, L: 1, M: 47.1274, S: 0.02160 },
      { ageInDays: 640, L: 1, M: 47.3322, S: 0.02143 },
      { ageInDays: 670, L: 1, M: 47.5285, S: 0.02127 },
      { ageInDays: 701, L: 1, M: 47.7170, S: 0.02112 },
      { ageInDays: 731, L: 1, M: 47.8985, S: 0.02098 }
    ]
  }
};

