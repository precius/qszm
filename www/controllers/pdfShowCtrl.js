angular.module('pdfShowCtrl', ['ionic']).controller('pdfShowCtrl', ["$scope", "$stateParams", "$ionicLoading", "$ionicHistory",
	function($scope, $stateParams, $ionicLoading, $ionicHistory) {
		$scope.jsonObj = $stateParams.jsonObj;
		$scope.pdfUrl = $scope.jsonObj.pdfUrl; //pdf路径
		$scope.pdfName = $scope.jsonObj.pdfName; //pdf名称，如test.pdf
		$scope.pdfLocalDirctory = $scope.jsonObj.pdfLocalDirctory; //pdf本地存放路径,如ExampleProject
		$scope.pdfLocalUrl = "";
		$scope.pdfPassword = 'test';
		$scope.scroll = 0;

		$scope.goback = function() {
			$ionicHistory.goBack(); //返回上一个页面
		};
		$scope.getNavStyle = function(scroll) {
			if(scroll > 100) return 'pdf-controls fixed';
			else return 'pdf-controls';
		}

		$scope.onError = function(error) {
			console.log(error);
		}

		$scope.onLoad = function() {
			$scope.loading = '';
		}

		$scope.onProgress = function(progressData) {
			console.log(progressData);
		};

		$scope.onPassword = function(updatePasswordFn, passwordResponse) {
			if(passwordResponse === PDFJS.PasswordResponses.NEED_PASSWORD) {
				updatePasswordFn($scope.pdfPassword);
			} else if(passwordResponse === PDFJS.PasswordResponses.INCORRECT_PASSWORD) {
				console.log('Incorrect password')
			}
		};

		show = function() {
			$ionicLoading.show({
				template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner><p>加载中……</p>',
				duration: 10000
			});
		};
		hide = function() {
			$ionicLoading.hide();
		};
		//通过pdfUrl获取PDF文档，保存到本地进行显示
		$scope.download = function() {
			show();
			document.addEventListener("deviceready", function() {
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
						fs.root.getDirectory(
							$scope.pdfLocalDirctory, {
								create: true
							},
							function(dirEntry) {
								dirEntry.getFile(
									$scope.pdfName, {
										create: true,
										exclusive: false
									},
									function gotFileEntry(fe) {
										var p = fe.toURL();
										fe.remove();
										ft = new FileTransfer();
										ft.download(
											encodeURI($scope.pdfUrl),
											p,
											function(entry) {
												hide();
												$scope.arquivo = entry.toURL();
												$scope.pdfLocalUrl = entry.toURL();
												console.log('internet-estate----pdfUrl->' + $scope.pdfUrl);
												console.log('internet-estate----pdfLocalUrl->' + $scope.pdfLocalUrl);
											},
											function(error) {
												hide();
												console.log('internet-estate----error->' + error.message);
											},
											false,
											null
										);
									},
									function() {
										hide();
										console.log('internet-estate----$ionicLoading.hide()->' + "Get file failed");
									}
								);
							}
						);
					},
					function() {
						$ionicLoading.hide();
						console.log('internet-estate----$ionicLoading.hide()->' + "Request for filesystem failed");
					});
			}, false);
			/*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
					fs.root.getDirectory(
						$scope.pdfLocalDirctory, {
							create: true
						},
						function(dirEntry) {
							dirEntry.getFile(
								$scope.pdfName, {
									create: true,
									exclusive: false
								},
								function gotFileEntry(fe) {
									var p = fe.toURL();
									fe.remove();
									ft = new FileTransfer();
									ft.download(
										encodeURI($scope.pdfUrl),
										p,
										function(entry) {
											hide();
											$scope.arquivo = entry.toURL();
											$scope.pdfLocalUrl = entry.toURL();
											console.log('internet-estate----pdfUrl->' + $scope.pdfUrl);
											console.log('internet-estate----pdfLocalUrl->' + $scope.pdfLocalUrl);
										},
										function(error) {
											hide();
											console.log('internet-estate----error->' + error.message);
										},
										false,
										null
									);
								},
								function() {
									hide();
									console.log('internet-estate----$ionicLoading.hide()->' + "Get file failed");
								}
							);
						}
					);
				},
				function() {
					$ionicLoading.hide();
					console.log('internet-estate----$ionicLoading.hide()->' + "Request for filesystem failed");
				});*/
		};
		$scope.download();
	}
]);