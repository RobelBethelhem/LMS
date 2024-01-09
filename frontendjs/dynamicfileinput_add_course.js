  $(document).ready(function () {
      $(".custom-file-input").change(function () {
          displaySelectedFiles($(this));
      });

      function displaySelectedFiles(inputElement) {
          var displayDiv = $("#" + inputElement.attr("id") + "Display");
          displayDiv.empty();

          // Create a new FormData object
          var formData = new FormData();

          // Display selected files
          for (var i = 0; i < inputElement[0].files.length; i++) {
              var fileName = inputElement[0].files[i].name;

              var fileDiv = $("<div class='selected-file'>");
              fileDiv.text(fileName);

              // Add a cancel button to remove the selected file
              var cancelButton = $("<span class='cancel-button'>&times;</span>");
              cancelButton.click(createCancelButtonHandler(inputElement, formData, i));
              fileDiv.append(cancelButton);

              displayDiv.append(fileDiv);

              // Append the file to the FormData object
              formData.append(inputElement.attr("name"), inputElement[0].files[i]);
          }
      }

      function createCancelButtonHandler(inputElement, formData, fileIndex) {
    return function () {
        // Remove the specific file from the formData object
        var files = Array.from(formData.getAll(inputElement.attr("name")));
        files.splice(fileIndex, 1);
        formData.delete(inputElement.attr("name"));
        files.forEach(function(file) {
            formData.append(inputElement.attr("name"), file);
        });

        // Update the file input and display
        var newFiles = formData.getAll(inputElement.attr("name"));
        var newFileList = new DataTransfer();
        newFiles.forEach(function(file) {
            newFileList.items.add(file);
        });
        inputElement[0].files = newFileList.files;
        displaySelectedFiles(inputElement);
    };
}
  });
