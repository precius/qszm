angular.module('fjxzUtilsService', ['ngResource']).factory('$fjxzUtilsService', ['$gmRestful','$interval','$loginService','$addressService','$wysqService', '$ionicPopup','$ionicActionSheet','$cordovaCamera', '$cordovaImagePicker',function ($gmRestful,$interval,$loginService,$addressService,$wysqService,$ionicPopup,$ionicActionSheet,$cordovaCamera, $cordovaImagePicker) {	
    var result = {
	 //验证数据是否可以提交
	 verifyData: function($scope) {
        // $scope.sqrxgclList;//与申请人/权利人/义务人相关的
        // $scope.bzclList;
        // $scope.fbzclList;
        if ($scope.fjzlList == null || $scope.fjzlList.length == 0) {
          $scope.showAlert('未获取到附件材料信息');
          return false;
        }
        // 遍历申请人相关材料列表
        for (var a = 0; a < $scope.sqrxgclList.length; a++) {

          if (!$scope.sqrxgclList[a].sfbx || //非必须的材料可以不校验
            $scope.sqrxgclList[a].clmc == '申请视频' ||
            $scope.sqrxgclList[a].clmc == '询问笔录' ||
            $scope.sqrxgclList[a].clmc == '不动产登记申请书' ||
            $scope.sqrxgclList[a].clmc.indexOf('完税') != -1) {
            continue; //申请视频,询问笔录,不动产登记申请书不用验证,有其他的验证方式
          }
          var peopleList = $scope.sqrxgclList[a].peopleList;
          for (var b = 0; b < peopleList.length; b++) {
            var people = peopleList[b];
            var fjxlList = people.fjxlList;
            for (var c = 0; c < fjxlList.length; c++) {
              var fjxl = fjxlList[c];
              if (people.qlrlx == fjxl.type && (fjxl.fileId == null || fjxl.fileId == '' || fjxl.imgSrc == null ||
                  fjxl.imgSrc == '')) {
                $scope.showAlert(people.name + '未上传' + fjxl.name);
                return false;
              };
            };
          };
        };
        //遍历所有标准材料集合
        for (var a = 0; a < $scope.bzclList.length; a++) {
          if (!$scope.bzclList[a].sfbx || //非必须的材料可以不校验
            $scope.bzclList[a].clmc == '申请视频' ||
            $scope.bzclList[a].clmc == '询问笔录' ||
            $scope.bzclList[a].clmc == '不动产登记申请书' ||
            $scope.bzclList[a].clmc.indexOf('完税') != -1) {
            continue; //申请视频,询问笔录,不动产登记申请书不用验证,有其他的验证方式
          }
          var fjxlList = $scope.bzclList[a].fjxlList;
          for (var c = 0; c < fjxlList.length; c++) {
            var fjxl = fjxlList[c];
            if (fjxl.fileId == null || fjxl.fileId == '' || fjxl.imgSrc == null ||
              fjxl.imgSrc == '') {
              $scope.showAlert('未上传' + fjxl.name);
              return false;
            };
          };
        };
        //遍历所有非标准材料集合
        for (var a = 0; a < $scope.fbzclList.length; a++) {
          if (!$scope.fbzclList[a].sfbx || //非必须的材料可以不校验
            $scope.fbzclList[a].clmc == '申请视频' ||
            $scope.fbzclList[a].clmc == '询问笔录' ||
            $scope.fbzclList[a].clmc == '不动产登记申请书' ||
            $scope.fbzclList[a].clmc.indexOf('完税') != -1) {
            continue; //申请视频,询问笔录,不动产登记申请书不用验证,有其他的验证方式
          }
          if ($scope.fbzclList[a].fjxl.imgList == null || $scope.fbzclList[a].fjxl.imgList.length == 0) {
            $scope.showAlert('未上传' + fjxl.name);
            return false;
          }
        }
        return true;
		},    	
		hasPhotoToUpload : function(fjzlListTemp){
			var result = false;
			if(fjzlListTemp != null && fjzlListTemp.length>0){
				for(var j = 0;j<fjzlListTemp.length;j++){
					var fjzlItem = fjzlListTemp[j];
					//一个种类包含的附件列表
					var filelist = fjzlItem.filelist;
					if(filelist != null && filelist.length>0){
						for(var i = 0;i<filelist.length;i++){
							//一个附件
							var file = filelist[i];
							if(file.fileid == "0"){
								result = true;
								break;
							}
						}
					}
					if(result == true){
						break;
					}
					
				}
			}
			return result;
		},
		//根据业务号获取所有附件
		getAllFjByYwh : function(wwywhTemp,callback){
			$wysqService.getFj({ywh:wwywhTemp})
			.then(function(res) {
					if (res.success) {
						//所有材料列表
						var filelistAll = res.data;
						callback(filelistAll);
					}
			}, function(res) {});
		},	
		//上传完之后，刷新当前材料分类的附件列表
		getFjByFjzl : function(wwywhTemp,fjzlListTemp,fjzlParam,callback){
			$wysqService.getFj({ywh:wwywhTemp})
			.then(function(res) {
					if (res.success) {
						//所有材料列表
						var filelistAll = res.data;
							//材料分类列表
							if(fjzlListTemp != null && fjzlListTemp.length>0){
								for(var j = 0;j<fjzlListTemp.length;j++){
									var fjzlTemp = fjzlListTemp[j];
									if(fjzlParam != undefined && fjzlParam.clmc != undefined && fjzlParam.clmc != null && fjzlParam.clmc != ""){
										if(fjzlParam.clmc == fjzlTemp.clmc){
											fjzlTemp.filelist = [];
											for (var i = 0; i < filelistAll.length; i++) {
												var fileTemp = filelistAll[i]; 
												fileTemp.src = "";//显示使用
												fileTemp.uploadSrc = "";//上传使用
												fileTemp.status = "已上传";
												//上传材料中的材料分类与附件种类中的材料名称对应起来
												if(fileTemp.clfl == fjzlTemp.clmc){
													fjzlTemp.filelist.push(fileTemp);
												}										
											}
											callback(fjzlTemp.filelist);
											break;
										}
									}
								}
							}
					}
			}, function(res) {});
		},
		//根据材料名称将附件设置到附件列表中
		setFileToListByclmc : function(filelistAll,fjzl,zjhTemp){
			fjzl.filelist = [];
			for (var i = 0; i < filelistAll.length; i++) {
				var fileTemp = filelistAll[i];
				fileTemp.src = ""; //显示使用
				fileTemp.uploadSrc = ""; //上传使用
				fileTemp.status = "已上传";
				//上传材料中的材料分类与附件种类中的材料名称对应起来
				if (fileTemp.clfl == fjzl.clmc) {
					if(zjhTemp != undefined){
						if(fileTemp.zjh == zjhTemp){
							fjzl.filelist.push(fileTemp);
						}
					}else{
						fjzl.filelist.push(fileTemp);
					}
				}
			}		
		},			
		//从Fms中获取文件列表
		getFileListFromFms : function(filelistTemp,callback){
			if (filelistTemp) {
				//获取图片src和fileid
				for (var i = 0; i < filelistTemp.length; i++) {
					console.log(filelistTemp[i].fileId+"+id:"+filelistTemp[i].id);
					$wysqService.getfileList({
							id: filelistTemp[i].fileId
						})
						.then(function(res) {
							if (res.success) {
								callback(res);
							}
					}, function(res) {});
				}
			}	
		},		
		//将获取的图片地址设置到附件列表中去
		setImgSrcToFile : function(fjzlItem,src,fileid){
			//一个种类包含的附件列表
			var filelist = fjzlItem.filelist;
			if(filelist != null && filelist.length>0){
				for(var i = 0;i<filelist.length;i++){
					//一个附件
					var file = filelist[i];
					if(fileid == file.fileId){
						file.src = src;
						break;
					}
				}
			}
		},    	
		addPhoto : function(fjzlTemp,callback) {
			$ionicActionSheet.show({
				cancelOnStateChange: true,
				cssClass: 'action_s',
				titleText: "请选择获取图片方式",
				addCancelButtonWithLabel: '取消',
				androidEnableCancelButton: true,
				buttons: [{
					text: '相机'
				}, {
					text: '图库'
				}],
				cancelText: '取消',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {
					callback(index);
					return true;
				}
			});
		},  	
		//调用摄像头拍照
		takePhoto : function(fjzlTemp,callback) {
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA, //资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
				targetWidth: 400, //宽度
				targetHeight: 300 //高度
			};
	
			$cordovaCamera.getPicture(options)
				.then(function(imageURI) {
					fjzlTemp.filelist.push({
						src: "data:image/jpeg;base64," + imageURI,
						uploadSrc:imageURI,
						fileid: "0",
						status: "未上传"
					});						
					callback(imageURI);
				}, function(err) {
					// Error
				});
		},   
		pickImage : function(fjzlTemp,callback) {
			var options = {
				quality: 100,
				//destinationType: Camera.DestinationType.FILE_URI, 
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM, //资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
				targetWidth: 400, //宽度
				targetHeight: 300 //高度
			};
	
			$cordovaCamera.getPicture(options)
				.then(function(imageURI) {
					fjzlTemp.filelist.push({
						src: "data:image/jpeg;base64," + imageURI,
						uploadSrc:imageURI,
						fileid: "0",
						status: "未上传"
					});
					callback(imageURI);	
				}, function(err) {
					// Error
				});
		},	
		//显示大图获取图片资源路径
		getSrcById : function(id,fjzlListTemp){
			if(fjzlListTemp != null && fjzlListTemp.length>0){
				for(var j = 0;j<fjzlListTemp.length;j++){
					var fjzlItem = fjzlListTemp[j];
					//一个种类包含的附件列表
					var filelist = fjzlItem.filelist;
					if(filelist != null && filelist.length>0){
						for(var i = 0;i<filelist.length;i++){
							//一个附件
							var file = filelist[i];
							if(id == file.id){
								return file.src;
							}
						}
					}
				}
			}
		},
		//显示大图获取图片资源路径
		getSrcByIdFileList : function(id,filelist) {
				if (filelist != null && filelist.length > 0) {
					for (var i = 0; i < filelist.length; i++) {
						//一个附件
						var file = filelist[i];
						if (id == file.id) {
							return file.src;
						}
					}
				}
		},	
		getUploadData : function(fjzlTemp){
			var resultDatas = [];
			if(fjzlTemp.filelist != undefined && fjzlTemp.filelist.length>0){
				for(var i = 0;i<fjzlTemp.filelist.length;i++){
					var fileTemp = fjzlTemp.filelist[i];
					if(fileTemp.fileid == "0"){
						resultDatas.push(fileTemp);
					}
				}
			}
			return resultDatas;
		},		
		//上传单张照片到服务器
		uploadOnePhotoToServer: function($scope, time, djjgParam, ywhParam, clmcParam, clsmParam, sxhParam,
			file, fileName, people, fjxl, callback) {
			var fileDir = djjgParam + '/' + time + '/' + ywhParam + '/' + clmcParam;
			var formData = new FormData();
			formData.append('file', file, fileName);
			formData.append('dir', fileDir);
			formData.append('recover', true);
			var request = new XMLHttpRequest();
			request.onreadystatechange = function() {
			  if (request.readyState == 4) {
				if (request.status == 200) {
				  var res = JSON.parse(request.response); //文件上传成功后返回的数据
				  var result = {
					filexxSuccess: [],
					filexxFail: []
				  };
				  //根据是标准还是其他材料,保存不同的clmc到业务库
				  if ($scope.fjzl.uploadfileConfig.cllb == 'fbzcl') { //非标准材料
					var clmcToYwk = fjxl.name + sxhParam + '.jpg';
				  } else {
					var clmcToYwk = res.data.fileName; //用上传的文件名赋值
				  }
				  //保存到业务库
				  result.filexxSuccess.push({
					ywh: ywhParam,
					clfl: clmcParam,
					clmc: clmcToYwk,
					fileId: res.data.id,
					fileUrl: res.data.filePathUrl,
					clsm: clsmParam,
					sxh: sxhParam,
					zjh: ''
				  });
				  callback(result);
	
	
				} else {
				  $scope.showAlert("上传单张照片到文件库失败!");
				  var result = {
					filexxSuccess: [],
					filexxFail: []
				  };
				  //上传到fms失败
				  result.filexxFail.push({
					ywh: $wysqService.djsqItemData.ywh,
					clfl: $scope.fjzl.clmc,
					clsm: $scope.fjzl.clsm,
					sxh: $scope.fjzl.sxh
				  });
				  callback(result);
				}
			  }
			};
			request.open('POST', fmsServer + 'file/uploadFile');
			request.send(formData);
	
	
		  },
		//上传图片信息(会删除同名文件)
		uploadPhotoYwData: function($scope, filexxSuccess, callback) {
			$wysqService.savefile({
				uploadfiles: filexxSuccess
			  })
			  .then(function(res) {
				if (res.success == true) {
				  //$scope.showAlert('上传单张照片完成');
				  //重新获取列表
				  callback(res);
				} else {
				  callback(res);
				  $scope.showAlert('上传照片到业务库失败');
				}
			  }, function(res) {
				callback(res);
				$scope.showAlert('上传照片到业务库失败');
				console.log(res.message);
			  });
		  },
		//更新图片信息(会覆盖已有文件)
		uploadPhotoYwData1: function($scope, filexxSuccess, callback) {
			$wysqService.updateFileInfo({
				uploadfiles: filexxSuccess
			  })
			  .then(function(res) {
				if (res.success == true) {
				  //$scope.showAlert('上传单张照片完成');
				  //重新获取列表
				  callback(res);
				} else {
				  callback(res);
				  $scope.showAlert('上传照片到业务库失败');
				}
			  }, function(res) {
				callback(res);
				$scope.showAlert('上传照片到业务库失败');
				console.log(res.message);
			  });
		  },
		deleteOneFile : function($scope,file,callback) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您确定要删除该照片吗?',
				cancelText: '取消',
				okText: '确认',
				cssClass: 'dialog'
			});
			confirmPopup.then(function(res) {
				if (res) {
					if (file.fileid == "0") {
						deleteFile(file);
					} else {
						$wysqService.deleteUploadFile({
								id: file.id
							})
							.then(function(res) {
								$wysqService.delFileById({
										id: file.fileId,
										status: '2'
									})
									.then(function(res) {
										$scope.showAlert('删除成功！');
									}, function(res) {
										$scope.showAlert('删除失败！');
									});
									callback(res);
							}, function(res) {
								$scope.showAlert('删除失败！');
							});
		
					}
				}
			});
		},	
		deleteLocalFile : function(fjzlItem,fileTemp){
			//一个种类包含的附件列表
			var filelist = fjzlItem.filelist;
			if(filelist != null && filelist.length>0){
				for(var i = 0;i<filelist.length;i++){
					//一个附件
					var file = filelist[i];
					if(fileTemp.src == file.src){
						filelist.splice(i,1)
						break;
					}
				}
			}
		},		
      /**
       * 根据以下三种材料将附件列表再适配一遍
       * fbzcl     -非标准材料,如合同号,数量可能非固定
       * bzcl      -标准材料,含有小类,如 XX证明  包含 1.XX证明正面  2.XX证明反面
       * sqrxgcl   -申请人相关材料  所有申请人都需要上传 需要遍历所有申请人并且去重
       */
      adaptFjcl: function($scope) {
        if ($scope.fjzlList == null || $scope.fjzlList.length == 0) {
          return;
        }
        //遍历所有材料大类
        for (var i = 0; i < $scope.fjzlList.length; i++) {
          if ($scope.fjzlList[i].sfzs == '0') { //是否展示为0时,不展示,直接过滤掉
            continue;
          }
          if ($scope.fjzlList[i].uploadfileConfig.cllb == 'fbzcl') {
            $scope.fjzlList[i].fjxl = $scope.fjzlList[i].uploadfileConfig.backgrounds[0];
            $scope.fjzlList[i].fjxl.imgList = []; //非标准材料,设定为只有一个小类,但是可以有多张图片,
            $scope.fbzclList.push($scope.fjzlList[i]);
          }
          if ($scope.fjzlList[i].uploadfileConfig.cllb == 'bzcl') { //标准材料,有多个小类,但是与申请人数量无关
            $scope.fjzlList[i].fjxlList = $scope.fjzlList[i].uploadfileConfig.backgrounds;
            $scope.bzclList.push($scope.fjzlList[i]);
          }
          if ($scope.fjzlList[i].uploadfileConfig.cllb == 'sqrxgcl') {
			// 该方法需重新处理
            const allApplicant = $wysqService.getAllApplicant(); 
            $scope.fjzlList[i].peopleList = [];
            for (var a = 0; a < allApplicant.length; a++) {
              const people = {};
              people.name = allApplicant[a].name;
              people.zjh = allApplicant[a].zjh;
              people.qlrlx = allApplicant[a].qlrlx;
              people.fjxlList = angular.copy($scope.fjzlList[i].uploadfileConfig.backgrounds);
              $scope.fjzlList[i].peopleList.push(people);
            }

            $scope.sqrxgclList.push($scope.fjzlList[i]);
          }
          if ($scope.fjzlList[i].uploadfileConfig.cllb == 'qlrxgcl') {
            const qlrList = $wysqService.djsqItemData.children[0].qlrs; 
            $scope.fjzlList[i].peopleList = [];
            for (var b = 0; b < qlrList.length; b++) {
              const people = {};
              people.name = qlrList[b].qlrmc;
              people.zjh = qlrList[b].zjh;
              people.qlrlx = qlrList[b].qlrlx;
              people.fjxlList = angular.copy($scope.fjzlList[i].uploadfileConfig.backgrounds);
              $scope.fjzlList[i].peopleList.push(people);
            }

            $scope.sqrxgclList.push($scope.fjzlList[i]);
          }
          if ($scope.fjzlList[i].uploadfileConfig.cllb == 'ywrxgcl') {
            const ywrList = $wysqService.djsqItemData.children[0].ywrs; //义务人集合todo 去重
            $scope.fjzlList[i].peopleList = [];
            for (var c = 0; c < ywrList.length; c++) {
              const people = {};
              people.name = ywrList[c].ywrmc;
              people.zjh = ywrList[c].zjh;
              people.qlrlx = ywrList[c].qlrlx;
              people.fjxlList = angular.copy($scope.fjzlList[i].uploadfileConfig.backgrounds);
              $scope.fjzlList[i].peopleList.push(people);
            }

            $scope.sqrxgclList.push($scope.fjzlList[i]);
          }
        }
        $scope.getAllFileList();
        console.log('所有跟申请人/权利人/义务人相关的附件');
        console.log($scope.sqrxgclList);
      },


      //将所有图片归类到对应的附件种类中,其中与申请人想过的要归类到对应的小类中
      setFileToFjList: function($scope, fileList) {
        if (fileList == null || fileList.length == 0) {
          return;
        }
        for (var j = 0; j < fileList.length; j++) {
          var fileData = fileList[j];
          var clfl = fileData.clfl;
          var fileUrl = fileData.fileUrl;
          var fileName = fileData.clmc;
          var fileId = fileData.fileId;
          var id = fileData.id;
          // $scope.fbzclList = [];
          // $scope.bzclList = [];
          // $scope.sqrxgclList = [];
          // $scope.qlrxgclList = [];
          // $scope.ywrxgclList = [];
          // 遍历申请人相关材料列表
          for (var a = 0; a < $scope.sqrxgclList.length; a++) {
            if (clfl == $scope.sqrxgclList[a].clmc) {
              var peopleList = $scope.sqrxgclList[a].peopleList;
              for (var b = 0; b < peopleList.length; b++) {
                var people = peopleList[b];
                var fjxlList = people.fjxlList;
                for (var c = 0; c < fjxlList.length; c++) {
                  var fjxl = fjxlList[c];
                  if (fileName.indexOf(people.name + fjxl.name + people.zjh) !=-1) {
                    fjxl.imgSrc = fileUrl;
                    fjxl.fileId = fileId;
                    fjxl.id = id;
                    fjxl.status = '已上传'
                    break;
                  };
                };
              };
            };
          };
          //遍历所有标准材料集合
          for (var a = 0; a < $scope.bzclList.length; a++) {
            if (clfl == $scope.bzclList[a].clmc) {
              var fjxlList = $scope.bzclList[a].fjxlList;
              for (var c = 0; c < fjxlList.length; c++) {
                var fjxl = fjxlList[c];
                if (fileName.indexOf(fjxl.name) != -1) {
                  fjxl.imgSrc = fileUrl;
                  fjxl.fileId = fileId;
                  fjxl.id = id;
                  fjxl.status = '已上传'
                  break;
                };
              };
            };
          };
          //遍历所有非标准材料集合
          for (var a = 0; a < $scope.fbzclList.length; a++) {
            if (clfl == $scope.fbzclList[a].clmc) {
              var imgData = {};
              imgData.imgSrc = fileUrl;
              imgData.fileId = fileId;
              imgData.id = id;
              imgData.status = '已上传';
              imgData.sxh = fileData.sxh;
              imgData.name = fileData.clmc;
              $scope.fbzclList[a].fjxl.imgList.push(imgData);
              break;
            };
          }

        }
      },
    };
    return result;
  }
]);
