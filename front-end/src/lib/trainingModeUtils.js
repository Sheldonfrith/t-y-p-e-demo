export function getPriorityList (currentTrainingMode = 'Special Character Emphasis') {
    //return an object with 
    //char codes as keys, and priority ratings (integers) as values
    switch (currentTrainingMode) {
        case 'Special Character Emphasis':
            return {"32": 1, "33": 4, "34": 7, "35": 7, "36": 7, "37": 4, "38": 7,
             "39": 7, "40": 10, "41": 10, "42": 7, "43": 4, "44": 10, "45": 7, "46": 10,
              "47": 7, "48": 1, "49": 1, "50": 1, "51": 1, "52": 1, "53": 1, "54": 1,
               "55": 1, "56": 1, "57": 1, "58": 7, "59": 7, "60": 7, "61": 7, "62": 7,
                "63": 4, "64": 4, "65": 1, "66": 1, "67": 1, "68": 1, "69": 1, "70": 1,
                 "71": 1, "72": 1, "73": 1, "74": 1, "75": 1, "76": 1, "77": 1, "78": 1,
                  "79": 1, "80": 1, "81": 1, "82": 1, "83": 1, "84": 1, "85": 1, "86": 1,
                   "87": 1, "88": 1, "89": 1, "90": 1, "91": 7, "92": 7, "93": 4, "94": 1,
                    "95": 10, "96": 4, "97": 1, "98": 1, "99": 1, "100": 1, "101": 1, "102": 1,
                     "103": 1, "104": 1, "105": 1, "106": 1, "107": 1, "108": 1, "109": 1, "110": 1,
                      "111": 1, "112": 1, "113": 1, "114": 1, "115": 1, "116": 1, "117": 1, "118": 1,
                       "119": 1, "120": 1, "121": 1, "122": 1, "123": 7, "124": 4, "125": 7, "126": 4};
        default:
            console.log('error in getPriorityList, invalid training mode string');
            return;
    }
}