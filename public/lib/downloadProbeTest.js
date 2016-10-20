(function () {
  'use strict';
  /**
   * DownloadProbe test to get sizes for download testing
   * @param string server endpoint for upload testing
   * @param boolean whether  latency conditions
   * @param integer length of the testLength
   * @param integer size of the download request
   * @param function callback function for test suite complete event
   * @param function callback function for test suite error event
   **/
   function downloadProbeTest(url, lowLatency, timeout,size, callbackComplete,callbackError) {
     this.url = url;
     this.lowLatency = lowLatency;
     this.timeout = timeout;
     this.size = size;
     this._testIndex = 0;
     this._results;
     this.clientCallbackComplete = callbackComplete;
     this.clientCallbackError = callbackError;

   };

   /**
   * Execute the request
   */
   downloadProbeTest.prototype.start = function () {
     var cachebuster = Date.now();
     this._test = new window.xmlHttpRequest('GET', [this.url, '&', cachebuster].join(''), this.timeout, this.onTestComplete.bind(this),
       this.onTestProgress.bind(this),this.onTestAbort.bind(this), this.onTestTimeout.bind(this), this.onTestError.bind(this));
     this._testIndex++;
     this._test.start(0, this._testIndex);
   };
   /**
   * onError method
   * @param error object
   */
   downloadProbeTest.prototype.onTestError = function (result) {
     this.clientCallbackError(result);
   };
   /**
   * onAbort method
   * @param abort object
   */
   downloadProbeTest.prototype.onTestAbort = function (result) {
     this.clientCallbackError(result);
   };
   /**
   * onTimeout method
   * @param timeout object
   */
   downloadProbeTest.prototype.onTestTimeout = function (result) {
     this.clientCallbackError(result);
   };

   /**
   * onComplete method
   * @param probe object
   */
   downloadProbeTest.prototype.onTestComplete = function (result) {
      console.log(result);
      var self =this;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            var data = JSON.parse(xhr.responseText);
            //console.dir(data);
            self.clientCallbackComplete(data);
          }
      }
      xhr.open('GET', '/downloadProbe?bufferSize='+this.size+'&time='+result.time+'&lowLatency=true', true);
      xhr.send(null);
   };

   /**
   * onProgress method
   * @param  result
   */
   downloadProbeTest.prototype.onTestProgress = function(result){

     //console.log(this._progressResults['arrayProgressResults'+result.id].toString());
     //todo add moving average counter and formulate results and return to client
   };

   window.downloadProbeTest = downloadProbeTest;

 })();
//Example on how to call
/*
 function downloadProbeTestOnComplete(result){
   console.dir(result);
 }
 function downloadProbeTestOnError(result){
   console.dir(result);
 }

 var downloadProbeTestRun = new window.downloadProbeTest('/download?bufferSize=762939', false, 3000,762939,downloadProbeTestOnComplete,
 downloadProbeTestOnError);
 downloadProbeTestRun.start();
*/
