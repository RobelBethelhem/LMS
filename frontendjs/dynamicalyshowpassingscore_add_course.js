
  $(document).ready(function () {
      $("#course_status").change(function () {
          var selectedOption = $(this).val();

          // Check if the selected option is one of the last two options
          if (selectedOption === "pp" || selectedOption === "ppf") {
              $("#passing_score_label").show();
              $("#passing_score").show();
          } else {
              $("#passing_score_label").hide();
              $("#passing_score").hide();
          }
      });
  });
