angular.module('categoryUtils', ['ngResource']).factory('$categoryUtils', [function() {
  var result = {

    //根据流程编号返回对应的权利人 义务人名称 以及category信息
    getCategoryDatasByCode(netFlowCode) {
      
      return null;
    },
    categoryDatas: [{
      "name": "房屋转移",
      "code": "N200104",
      "data": [{
        "name": "申请信息",
        "formName": "form-fwzy",
        "default": true,
        "nameConfig": ["买方90", "卖方90"],
        "path": "wysq-fwzy-sqxx.html",
        "category": {
          "qlr": ["0"],
          "ywr": ["1"]
        }
      }]
    }, {
      "name": "国有建设用地使用权及房屋所有权登记变更登记",
      "code": "N300104",
      "data": [{
        "name": "申请信息",
        "formName": "form-fwbg",
        "default": true,
        "path": "wysq-fwbg-sqxx.html",
        "category": {
          "qlr": ["0"],
          "ywr": ["1"]
        }
      }]
    }, {
      "name": "房屋注销",
      "code": "N400104",
      "data": [{
        "name": "申请信息",
        "formName": "form-fwzx",
        "default": true,
        "path": "wysq-fwzx-sqxx.html",
        "category": {
          "qlr": ["0"]
        }
      }]
    }, {
      "name": "房屋更正",
      "code": "N500104",
      "data": [{
        "name": "申请信息",
        "formName": "form-fwgz",
        "default": true,
        "path": "wysq-fwgz-sqxx.html",
        "category": {
          "qlr": ["0"],
          "ywr": ["1"]
        }
      }]
    }, {
      "name": "预售商品房买卖预告登记",
      "code": "N100201",
      "data": [{
        "name": "申请信息",
        "formName": "form-ysspfmmyg",
        "default": true,
        "hideCqzh": true,
        "path": "wysq-ysspfmmyg-sqxx.html",
        "category": {
          "qlr": ["7"],
          "ywr": ["8"]
        }
      }]
    }, {
      "name": "预售商品房抵押权预告",
      "code": "N100203",
      "data": [{
        "name": "申请信息",
        "formName": "form-ysspfdyqyg",
        "default": true,
        "path": "wysq-ysspfdyqyg-sqxx.html",
        "category": {
          "qlr": ["9"],
          "ywr": ["10", "11"]
        }
      }]
    }, {
      "name": "预售商品房买卖预告注销登记",
      "code": "N360000",
      "data": [{
        "name": "申请信息",
        "formName": "form-ysspfmmygzx",
        "default": true,
        "path": "wysq-ygdjzx-sqxx.html",
        "category": {
          "qlr": ["7"],
          "ywr": ["8"]
        }
      }]
    }, {
      "name": "预售商品房抵押权预告注销登记",
      "code": "N300126",
      "data": [{
        "name": "申请信息",
        "formName": "form-ysspfdyqygzx",
        "default": true,
        "path": "wysq-ygdyzx-sqxx.html",
        "category": {
          "qlr": ["9"],
          "ywr": ["10", "11"]
        }
      }]
    }, {
      "name": "一般抵押权首次",
      "code": "N100301",
      "data": [{
        "name": "申请信息",
        "formName": "form-ybdyqsc",
        "default": true,
        "path": "wysq-ybdyqsc-sqxx.html",
        "category": {
          "qlr": ["4"],
          "ywr": ["5", "6"]
        }
      }]
    }, {
      "name": "抵押权注销",
      "code": "N400301",
      "data": [{
        "name": "申请信息",
        "formName": "form-dyqzx",
        "default": true,
        "path": "wysq-dyqzx-sqxx.html",
        "category": {
          "qlr": ["4"],
          "ywr": ["5", "6"]
        }
      }]
    }, {
      "name": "证书换证登记",
      "code": "N900102",
      "data": [{
        "name": "申请信息",
        "formName": "form-fwbg",
        "default": true,
        "path": "wysq-fwbg-sqxx.html",
        "category": {
          "qlr": ["0"]
        }
      }]
    }, {
      "name": "证书补证登记",
      "code": "N900101",
      "data": [{
        "name": "申请信息",
        "formName": "form-fwbg",
        "default": true,
        "path": "wysq-fwbg-sqxx.html",
        "category": {
          "qlr": ["0"]
        }
      }]
    }, {
      "name": "土地抵押首次",
      "code": "N200111",
      "data": [{
        "name": "申请信息",
        "formName": "form-tddysc",
        "default": true,
        "path": "wysq-tddyqsc-sqxx.html",
        "category": {
          "qlr": ["4"],
          "ywr": ["5", "6"]
        }
      }]
    }, {
      "name": "土地抵押注销",
      "code": "N200112",
      "data": [{
        "name": "申请信息",
        "formName": "form-tddyzx",
        "default": true,
        "path": "wysq-tddyqzx-sqxx.html",
        "category": {
          "qlr": ["4"],
          "ywr": ["5", "6"]
        }
      }]
    }, {
      "name": "在建工程首次抵押",
      "code": "N300099",
      "data": [{
        "name": "申请信息",
        "formName": "form-zjdyqsc",
        "default": true,
        "path": "wysq-zjdyqsc-sqxx.html",
        "category": {
          "qlr": ["4"],
          "ywr": ["5", "6"]

        }
      }]
    }, {
      "name": "在建工程抵押注销",
      "code": "N360099",
      "data": [{
        "name": "申请信息",
        "formName": "form-dyqzx",
        "default": true,
        "path": "wysq-dyqzx-sqxx.html",
        "category": {
          "qlr": ["4"],
          "ywr": ["5", "6"]
        }
      }]
    }, {
      "name": "所有权转移登记+抵押权首次登记",
      "code": "H999002",
      "same": {
        "qlr": {
          "category": "0",
          "form": "0"
        },
        "ywr": {
          "category": "5",
          "form": "1"
        }
      },
      "data": [{
          "name": "所有权转移登记",
          "formName": "form-fwzy",
          "default": true,
          "path": "wysq-fwzy-sqxx.html",
          "category": {
            "qlr": ["0"],
            "ywr": ["1"]
          }
        },
        {
          "name": "抵押权首次登记",
          "formName": "form-ybdyqsc",
          "default": false,
          "path": "wysq-ybdyqsc-sqxx.html",
          "category": {
            "qlr": ["4"],
            "ywr": ["5", "6"]
          }
        }
      ]
    }, {
      "name": "预告登记+抵押预告登记",
      "code": "H999001",
      "same": {
        "qlr": {
          "category": "7",
          "form": "0"
        },
        "ywr": {
          "category": "5",
          "form": "1"
        }
      },
      "data": [{
          "name": "预告登记",
          "formName": "form-ysspfmmyg",
          "default": true,
          "path": "wysq-ysspfmmyg-sqxx.html",
          "category": {
            "qlr": ["7"],
            "ywr": ["8"]
          }
        },
        {
          "name": "抵押权首次登记",
          "formName": "form-ybdyqsc",
          "default": false,
          "path": "wysq-ygdyzx-sqxx.html",
          "category": {
            "qlr": ["9"],
            "ywr": ["10", "11"]
          }
        }
      ]
    }, {
      "name": "所有权变更登记+所有权转移登记",
      "code": "H999003",
      "same": {
        "qlr": {
          "category": "0",
          "form": "0"
        },
        "ywr": {
          "category": "1",
          "form": "1"
        }
      },
      "data": [{
          "name": "所有权变更登记",
          "formName": "formfwbg",
          "default": true,
          "path": "wysq-fwbg-sqxx.html",
          "category": {
            "qlr": ["0"]
          }
        },
        {
          "name": "所有权转移登记",
          "formName": "formfwzy",
          "default": false,
          "path": "wysq-fwzy-sqxx.html",
          "category": {
            "qlr": ["0"],
            "ywr": ["1"]
          }
        }
      ]
    }]


  };
  return result;
}]);
