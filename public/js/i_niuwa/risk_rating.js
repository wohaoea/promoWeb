$(function(){
    var grade = 0;
    var $belongDom = $('.belong-type');
    var currentBelongType = $belongDom.attr('belong-type');
    var accomplishTest = 0;//是否完成测试( 0未完成、1完成 )
    againTest();
   $('.prev-problem').click(function(){
      if( accomplishTest == 1 ){
          accomplishTest = 0;
          $('.test-result').hide();
          $('.belong-type').show();
          $('.problem-container').last().addClass('problem-block');
          return;
      }
      var $currentProblem = $('.problem-block');
      var $prevProblemDom =  $currentProblem.prev();
      var currentNO =  $currentProblem.attr('data-pno');//当前题号
      var prevBelongType = $prevProblemDom.attr('belong-type');//上一题所属类型
      var prevBelongDesc = $prevProblemDom.attr('belong-desc');
      if( currentNO != 1 ){
          if( currentBelongType != prevBelongType ){
              currentBelongType = prevBelongType;
              $belongDom.attr('belong-type',prevBelongType);
              $belongDom.text(prevBelongDesc);
          }
          $currentProblem.removeClass('problem-block');
          $currentProblem.prev().addClass('problem-block');
       }
   });
   $('.radio').click(function(){
       var $parent = $(this).parents('.problem-container');
       var oldScore = $parent.find('.selected').attr('data-score');
       var newScore = $(this).attr('data-score');
       $parent.attr('data-accomplish',1);
       $parent.find('.radio').removeClass('selected');
       $(this).addClass('selected');
       if(oldScore){
           grade = grade + parseInt(newScore) - parseInt(oldScore);
       }else{
           grade = grade + parseInt(newScore);
       }
   });
   $('.next-problem').click(function(){
       var $parent = $(this).parents('.problem-container');
       var $nextProblemDom = $parent.next();
       var currentNO = $parent.attr('data-pno');
       var nextBelongType = $nextProblemDom.attr('belong-type');//下一题所属类型
       var nextBelongDesc = $nextProblemDom.attr('belong-desc');
       var accomplish = $parent.attr('data-accomplish');
       if( accomplish != 1 )return;
       if( currentNO != lastNo ){
           if( nextBelongType!= currentBelongType ){
               currentBelongType = nextBelongType;
               $belongDom.attr('belong-type',nextBelongType);
               $belongDom.text(nextBelongDesc);
           }
           $parent.removeClass('problem-block');
           if( currentNO == lastNo-1 && times == 2 ){$parent.next().find('.next-problem').css('background','#999')}
           $parent.next().addClass('problem-block');
       }else{
           if( times == 2 )return;
           accomplishTest = 1;
           var result = testResult( parseInt(grade) );
           $.post('/niuwa/saveRiskTestResult',{
               testScore:grade,
               riskLevel:result.riskLevel
           },function(result){
               if(!result.success){
                   $('#again').attr('href','/niuwa/riskRating');
               }
           });
           $('.result-type').text(result.type);
           $('.result-desc').text(result.desc);
           $('.belong-type').hide();
           $parent.removeClass('problem-block');
           $('.test-result').show();
       }
   });
   $('.start-btn').click(function(){
        $('.start-test').hide();
        $('.belong-type').show();
        $('.problem-container').first().addClass('problem-block');
   });
   function testResult( grade ){
       var result = {
           riskLevel:null,
           type:null,
           desc:null
       };
       if( 0 <= grade && grade <=14 ){
           result.riskLevel = 1;
           result.type = '保守型';
           result.desc = '根据测评结果，您对市场可能的风险持谨慎的态度，非常注重本金的安全性，投资目标是寻求资本的保值。';
       }else if( 15 <= grade && grade <= 24 ){
           result.riskLevel = 2;
           result.type = '稳健型';
           result.desc = '根据测评结果，您对市场可能的风险有一定的认识，可以承担一定中低类风险，在本金安全的基础上，期望资产获得一定的增长。';
       }else if( 25 <= grade && grade <= 34 ){
           result.riskLevel = 3;
           result.type = '成长型';
           result.desc = '根据测评结果，您对市场的风险有较强的认识，可以承担中等程度的风险，期望投资获得稳定的增长，对市场波动有一定认识。';
       }else if( 35 <= grade && grade <= 47 ){
           result.riskLevel = 4;
           result.type = '进取型';
           result.desc = '根据测评结果，您对市场风险有较深的认识，可以承担中高等级的风险，对中长期波动有较好的理解，期望在市场变化中获得较高回报。';
       }
       return result;
   }
    function againTest(){
        if( again == 'false' &&  testScore != 'null' ){
            var result = testResult(parseInt(testScore));
            $('.result-type').text(result.type);
            $('.result-desc').text(result.desc);
            $('.test-result').show();
        }
    }
});