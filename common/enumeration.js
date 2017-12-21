exports.safeProblem = [{
    key: "PROBLEM_ONE",
    value: "您母亲的姓名是？"
}, {
    key: "PROBLEM_TWO",
    value: "您父亲的姓名是？"
}, {
    key: "PROBLEM_THREE",
    value: "您配偶的姓名是？"
}, {
    key: "PROBLEM_FOUR",
    value: "您的出生地是？"
}, {
    key: "PROBLEM_FIVE",
    value: "您初中班主任的名字是？"
}, {
    key: "PROBLEM_SIX",
    value: "您的小学校名是？"
}, {
    key: "PROBLEM_SEVEN",
    value: "您母亲的生日是？"
}, {
    key: "PROBLEM_EIGHT",
    value: "您小学班主任的名字是？"
}, {
    key: "PROBLEM_NINE",
    value: "您配偶的生日是？"
}];
exports.getsafeProblem = function(key) {
    var ob = ''
    this.safeProblem.forEach(function(obj) {
        if (obj.key == key) {
            ob = obj
            return
        }
    });
    return ob;
};