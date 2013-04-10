var FS = function() {
    var FS = {};

    // params:
    //      - source is a string
    //      - destination is a string
    FS.copyFile = function(source, destination, new_name, callback) {
        window.resolveLocalFileSystemURI(source, resolveSuccess, resolveFailure);

        // file found and URI resolved
        function resolveSuccess(fileEntry) {
            // Get PERSISTENT file system object
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSys) {
                    // get destination directory 
                    fileSys.root.getDirectory(destination,
                        {create: true, exclusive: false},
                        getDirectorySuccess,
                        getDirectoryFailure);

                    function getDirectorySuccess(dir) { 
                        function fileCopySuccess(entry) {
                            // alert('copied successfully: ' + entry.fullPath);
                            callback(entry);
                        }

                        function fileCopyFailure(error) {
                            alert('Failed copy: ' + JSON.stringify(error));
                        }

                        fileEntry.copyTo(dir, new_name, fileCopySuccess, fileCopyFailure);
                    }

                    function getDirectoryFailure(error) {
                        alert('Failed: ' + JSON.stringify(error));
                    }

                }, function(error) { alert('FS failure: ' + JSON.stringify(error)); });
        }

        function resolveFailure(error) {
            alert('Resolve error: ' + JSON.stringify(error));
        }
    }

    FS.moveFile = function(source, destination, new_name, callback) {
        // pass the callback only to copyFile method
        FS.copyFile(source, destination, new_name, callback);

        // no need to pass the callback
        FS.removeFile(source);
    }

    FS.removeFile = function(source, callback) {
        window.resolveLocalFileSystemURI(source, resolveSuccess, resolveFailure);

        function resolveSuccess(fileEntry) {
            fileEntry.remove(success, fail);

            function success(entry) {
                console.log("Removal succeeded");
                callback(entry);
            }

            function fail(error) {
                alert('Error removing file: ' + error.code);
            }
        }
        function resolveFailure(error) { alert('resolve failure: ' + JSON.stringify(error)); }
    }

    return FS;
};
