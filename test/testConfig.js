var checkJson = {
    "itemCfgVal": 7,
    "creditAuth": 2
};

console.log(checkCustInfo(checkJson));
/* -1 juxinli auth failed, false other auth failed,true auth success*/
function checkCustInfo(checkJson) {
    var itemCfgVal = checkJson.itemCfgVal;
    var creditAuth = checkJson.creditAuth;
    if (!checkJson) return false;
    if (!itemCfgVal || !creditAuth) return false;
    var validate = true;
    var otherValidate = true;
    var lastJuxinliIndex = 9;
    var lastIndex = 0; /*from left to right*/
    while (itemCfgVal > 0) {
        lastIndex++;
        console.log(itemCfgVal % 2, creditAuth % 2, itemCfgVal % 2 > creditAuth % 2)
        if (itemCfgVal % 2 > creditAuth % 2) {
            validate = false;
            if (lastJuxinliIndex != lastIndex) {
                otherValidate = false;
            }
        }
        itemCfgVal = itemCfgVal >> 1;
        creditAuth = creditAuth >> 1;
    }
    if (!otherValidate) return false;
    if (!validate) return -1; //other has passed without juxinli
    return validate;
}

/**
 * 1 == (1 & itemCfgVal): 手机认证
 * 2 == (2 & itemCfgVal): 身份认证
 * 4 == (4 & itemCfgVal): 资金开户认证
 * 8 == (8 & itemCfgVal): 学籍认证
 * 16 == (16 & itemCfgVal): 通讯录认证
 * 32 == (32 & itemCfgVal): 绑卡认证
 * 64 == (64 & itemCfgVal): 父母基础信息认证
 * 128 == (128 & itemCfgVal): 是否扫描身份证通过
 * 256 == (256 & itemCfgVal): 聚信立通信认证
 * 512 == (512 & itemCfgVal): 聚信立人脸识别认证
 */