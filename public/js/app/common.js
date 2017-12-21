
var Common={
	  strToChars:function(str){
        var chars =[];
        for (var i = 0; i < str.length; i++){
            chars[i] = [str.substr(i, 1), this.isCHS(str,i)];
        }
        return chars;
    },
    isCHS:function(str,i){
      if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) 
        return true;
      else
        return false;
    },
    subString:function(str, length){
      if (!str) return "";
      var temstr="";
      var len = 0;
      var charsArray=this.strToChars(str);
      for (var i = 0; i < str.length; i++) {
        if (length <= len+2)
              return temstr+"..";
          else
              temstr += charsArray[i][0];

          if(charsArray[i][1])
              len += 2;
          else
              len++;
          
      }
      return temstr;

    },
};

module.exports=Common;