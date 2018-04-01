var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {
      // self.scans.unshift({ date: +(Date.now()), content: content });
      console.log(content);
      if (typeof self.scanner.scan() !== null) {
          let qrCode = String(content);
          let length = qrCode.length;
          let testType = qrCode.substring(0, length - 3);
          let testID = qrCode.substring(length - 3, length);
          console.log(qrCode);
          console.log(testID);
          document.getElementById("test-prefix").value = testType;
          document.getElementById("test-id").value = testID;
          document.getElementById("test-info").style.display = 'block';
          document.getElementById("test-prefix").style.display = 'inline-block';
          document.getElementById("test-id").style.display = 'inline-block';
          self.scanner.stop();
          document.getElementById("selfie").style.display = 'none';
          // document.getElementById("testID-div").style.display = 'block';
          if (document.getElementById('grading').checked) {
            document.getElementById("q").style.display = 'block';
            document.getElementById("sc").style.display = 'block';
          } else {
            document.getElementById("schoolID").style.display = 'block';
            document.getElementById("student1").style.display = 'block';
            if (testType !== "IND") {
                document.getElementById("student2").style.display = 'block';
            }
          }
          document.getElementById("next").style.display = 'none';
          document.getElementById("back").style.display = 'inline-block';
          document.getElementById("submit").style.display = 'inline-block';
          updateQNum();
      }
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    }
  }
});
