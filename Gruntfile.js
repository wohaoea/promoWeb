module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-contrib-concat");

    function config(zipname) {
        return {
            pkg: grunt.file.readJSON("package.json"),
            uglify: {
                release: {
                    options: {
                        mangle: true
                    },
                    files: {
                        "/desttemp/public/js/games/duanwu.min.js": [
                            "public/js/games/duanwu.js"
                        ],
                        "/desttemp/public/js/niubereg.min.js": ["public/js/niubereg.js"],
                        "/desttemp/public/js/niuwasummer.min.js": ["public/js/summeract.js"],
                        "/desttemp/public/js/pcregformarket.min.js": ["public/js/pcregformarket.js"],
                        "/desttemp/public/js/m4.min.js": ["public/js/jquery-ui.min.js", "public/js/jquery.flip.min.js", "public/js/m4.js"],
                        "/desttemp/public/js/yangguang.min.js": ["public/js/head.js", "public/js/yangguang.js", "public/js/readmsg.js"],
                        "/desttemp/public/js/h5reg.min.js": ["public/js/g.js", "public/js/h5reg.js"],
                        "/desttemp/public/js/toh5reg.min.js": ["public/js/g.js", "public/js/toh5reg.js"],
                        "/desttemp/public/js/h5reg_wifi.min.js": ["public/js/g.js", "public/js/h5reg_wifi.js"],
                        "/desttemp/public/js/kuantu.min.js": ["public/js/g.js", "public/js/kuantu.js"],
                        "/desttemp/public/js/article.min.js": ["public/js/article.js"],
                        "/desttemp/public/js/sjkh.min.js": ["public/js/head.js", "public/js/sjkh.js", "public/js/readmsg.js"],
                        "/desttemp/public/js/yao1yao.min.js": ["public/js/libs/shake.js", "public/js/yao1yao.js"],
                        "/desttemp/public/js/ceo.min.js": ["public/js/g.js", "public/js/ceo.js"],
                        "/desttemp/public/js/marketnew.min.js": ["public/js/jQuery-jcMarquee.js", "public/js/marketnew.js"],
                        "/desttemp/public/js/ceo.min.js": ["public/js/g.js", "public/js/ceo.js"],
                        "/desttemp/public/js/hhr.min.js": ["public/js/head.js", "public/js/readmsg.js", "public/js/hhr.js"],
                        "/desttemp/public/js/smashingeggs.min.js": ["public/js/smashingeggs.js", "public/js/readmsg.js", "public/js/head.js"],
                        "/desttemp/public/js/huixiangshenghuo.min.js": ["public/js/huixiangshenghuo.js", "public/js/huixiangshenghuoslider.js", "public/js/readmsg.js", "public/js/head.js", "public/js/gototop.js"],
                        "/desttemp/public/js/huixiangshenghuo_grid.min.js": ["public/js/head.js", "public/js/readmsg.js", "public/js/huixiangshenghuo_grid.js", "public/js/huixiangshenghuo.js", "public/js/gototop.js"],
                        "/desttemp/public/js/huixiangshenghuopages.min.js": ["public/js/head.js", "public/js/readmsg.js", "public/js/gototop.js", "public/js/huixiangshenghuopages.js"],
                        "/desttemp/public/js/jiaxipc.min.js": ["public/js/jiaxipc.js", "public/js/head.js", "public/js/readmsg.js", "public/js/gototop.js"],

                        "/desttemp/public/js/m9/fengkong-status.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/fengkong-status.js"],
                        "/desttemp/public/js/m9/fenqifuwu-confirm.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/palert.js", "public/js/m9/fenqifuwu-confirm.js"],
                        "/desttemp/public/js/m9/fenqifuwu-detail.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/fenqifuwu-detail.js"],
                        "/desttemp/public/js/m9/fenqifuwu-list.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/fenqifuwu-list.js"],
                        "/desttemp/public/js/m9/fenqifuwu-list-app.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/fenqifuwu-list-app.js"],
                        "/desttemp/public/js/m9/shenmeshitongxinrenzheng.min.js": ["public/js/m9/shenmeshitongxinrenzheng.js"],
                        "/desttemp/public/js/m9/shoujirenzheng-status.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/shoujirenzheng-status.js"],
                        "/desttemp/public/js/m9/tongxinrenzheng.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/tongxinrenzheng.js"],
                        "/desttemp/public/js/m9/repay_list.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/repay_list.js"],
                        "/desttemp/public/js/m9/repayment_details.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/repayment_details.js", "public/js/libs/palert.js"],
                        // "/desttemp/public/js/m9/confirm_apply.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/toast_phone.js", "public/js/m9/confirm_apply.js"],
                        "/desttemp/public/js/m9/fenqifuwu_second.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/toast_phone.js", "public/js/m9/fenqifuwu_second.js", "public/js/common/formSubmit.js"],
                        "/desttemp/public/js/m9/fuwu_check.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m9/toast_phone.js", "public/js/m9/circle.js"],


                        "/desttemp/public/js/m11/tobind.min.js": ["public/js/g.js", "public/js/common/formSubmit.js", "public/js/m11/tobind.js"],
                        "/desttemp/public/js/m11/findpwd.min.js": ["public/js/g.js", "public/js/libs/h5dialog.js", "public/js/common/validation.js", "public/js/m11/findpwd.js"],
                        "/desttemp/public/js/m11/yibao_bankcard.min.js": ["public/js/libs/jquery.iDialog.js", "public/js/libs/h5dialog.js", "public/js/m11/yibao_bankcard.js"],
                        "/desttemp/public/js/niubei_new.min.js": ["public/js/niubei_new.js"],
                        "/desttemp/public/js/refriend.min.js": ["public/js/head.js", "public/js/readmsg.js"],
                        "/desttemp/public/js/niubeireg.min.js": ["public/js/niubei.js"],
                        "/desttemp/public/js/spread.min.js": ["public/js/g.js", "public/js/spread.js"],
                        "/desttemp/public/js/mobiscroll.min.js": ["public/js/libs/mobiscroll.js"],
                        "/desttemp/public/js/sdhd.min.js": ["public/js/sdhd.js"],
                        "/desttemp/public/js/sdhdhelp.min.js": ["public/js/sdhdhelp.js"],
                        "/desttemp/public/js/nxhd.min.js": ["public/js/nxhd.js"],
                        "/desttemp/public/js/iscroll.min.js": ["public/js/libs/iscroll/iscroll-probe.js", "public/js/libs/iscroll/iscroll-load-data.js"],
                        "/desttemp/public/js/fudai.min.js": ["public/js/fudai.js"],
                        "/desttemp/public/js/guoqing.min.js": ["public/js/guoqing.js"],
                        "/desttemp/public/js/xsqg.min.js": ["public/js/gray.min.js", "public/js/head.js", "public/js/readmsg.js", "public/js/xsqg.js", "public/js/gototop.js"],
                        "/desttemp/public/js/xsqgdetail.min.js": ["public/js/head.js", "public/js/readmsg.js", "public/js/xsqgdetail.js"],
                        "/desttemp/public/js/iscroll.min.js": ["public/js/libs/iscroll/iscroll-probe.js", "public/js/libs/iscroll/iscroll-load-data.js"],
                        "/desttemp/public/js/fudai.min.js": ["public/js/fudai.js"],
                        "/desttemp/public/js/xsqg.min.js": ["public/js/gray.min.js", "public/js/head.js", "public/js/readmsg.js", "public/js/xsqg.js", "public/js/gototop.js"],
                        "/desttemp/public/js/xsqgdetail.min.js": ["public/js/head.js", "public/js/readmsg.js", "public/js/xsqgdetail.js", "public/js/gototop.js","public/js/common/formSubmit.js"],
                        "/desttemp/public/js/iscroll.min.js": ["public/js/libs/iscroll/iscroll-probe.js", "public/js/libs/iscroll/iscroll-load-data.js"],
                        "/desttemp/public/js/dfh.min.js": ["public/js/head.js", "public/js/gotop.js", "public/js/dfh.js", "public/js/readmsg.js"],
                        "/desttemp/public/js/award.min.js": ["public/js/award.js"],
                        "/desttemp/public/js/luckDraw.min.js": ["public/js/luckDraw.js"],
                        "/desttemp/public/js/fullpage.min.js":["public/js/zepto.js" , "public/fullpage/zepto.fullpage.js"],
                        "/desttemp/public/js/findpassword.min.js": ["public/js/g.js","public/js/common/validation.js","public/js/account/findpassword.js"],
                        "/desttemp/public/js/register.min.js": ["public/js/g.js","public/js/account/register.js"],
                        "/desttemp/public/js/identity_auth.min.js": ["public/js/g.js","public/js/common/validation.js","public/js/common/formSubmit.js","public/js/account/identity_auth.js"],
                        "/desttemp/public/js/login.min.js": ["public/js/g.js","public/js/account/login.js"],
                        "/desttemp/public/js/invitereg.min.js": ["public/js/g.js","public/js/account/invitereg.js","public/js/common/formSubmit.js"],
                        "/desttemp/public/js/userSign.min.js": ["public/js/userSign.js"],
                        "/desttemp/public/js/generalize.min.js": ["public/js/account/generalize.js","public/js/g.js"],
                        "/desttemp/public/js/generalize.niuwa.min.js": ["public/js/g.js","public/js/generalize/niuwa.js"],


                        "/desttemp/public/js/langdon/apply.min.js": ["public/js/langdon/apply.js"],
                        "/desttemp/public/js/langdon/auditing.min.js": ["public/js/m9/circle.js","public/js/langdon/auditing.js"],
                        "/desttemp/public/js/langdon/langDon.min.js": ["public/js/langdon/langDon.js"],
                        "/desttemp/public/js/langdon/success.min.js": ["public/js/langdon/success.js"],
                        "/desttemp/public/js/langdon/waitLoan.min.js": ["public/js/m9/circle.js","public/js/langdon/waitLoan.js"],

                        "/desttemp/public/js/jquery.fullpage.min.js": ["public/jquery.fullpage/js/jquery-1.8.3.min.js","public/jquery.fullpage/js/jquery.fullPage.min.js","public/jquery.fullpage/js/jquery.slimscroll.min.js"],
                        "/desttemp/public/js/i_niuwa/risk_rating.min.js": ["public/js/i_niuwa/risk_rating.js"],
                        "/desttemp/public/js/i_niuwa/treasure_calendar.min.js": ["public/js/i_niuwa/treasure_calendar.js"],
                        "/desttemp/public/js/zepto.fullpage.min.js": ["public/js/libs/zepto.js","public/fullpage/zepto.fullpage.js"],
                        "/desttemp/public/js/nwusersign.min.js": ["public/js/nwusersign.js"],
                        "/desttemp/public/js/thanksgiving.min.js": ["public/js/thanksgiving.js"]
                    }
                }
            },
            concat: {
                release: {
                    files: {
                        "/desttemp/public/css/niuwah5.min.css": ["public/css/niuwah5.css"],
                        "/desttemp/public/css/niubeiNew.min.css": ["public/css/niubeiNew.css"],
                        "/desttemp/public/css/earlybird.min.css": ["public/css/jquery.fullPage.css", "public/css/earlybird.css", "public/css/idialog.css"],
                        "/desttemp/public/promo/css/promo.min.css": ["public/promo/css/normalize.css", "public/promo/css/main.css", "public/promo/css/css.css"],
                        "/desttemp/public/css/duanwu.min.css": ["public/css/duanwu.css", "public/css/idialog.css"],
                        "/desttemp/public/css/summer.min.css": ["public/css/m2.css", "public/css/idialog.css"],
                        "/desttemp/public/css/niubereg.min.css": ["public/css/niubereg.css"],
                        "/desttemp/public/css/regmarket.min.css": ["public/css/regmarket.css", "public/css/idialog.css"],
                        "/desttemp/public/css/regmarketnew.min.css": ["public/css/regmarketnew.css", "public/css/idialog.css"],
                        "/desttemp/public/css/h5reg_new.min.css": ["public/css/h5dialog.css", "public/css/h5reg_new.css"],
                        "/desttemp/public/css/niubei.min.css": ["public/css/niubei.css"],
                        "/desttemp/public/css/m3niubei.min.css": ["public/css/jquery.fullPage.css", "public/css/m3niubei.css"],
                        "/desttemp/public/css/m4.min.css": ["public/css/m4.css", "public/css/idialog.css"],
                        "/desttemp/public/css/niubeidescNew.min.css": ["public/css/niuwah5.css", "public/css/swiper.css", "public/css/niubeidescNew.css"],
                        "/desttemp/public/css/niubeplan.min.css": ["public/css/base.css", "public/css/niubeplan.css"],
                        "/desttemp/public/css/yangguang.min.css": ["public/css/idialog.css", "public/css/yangguang.css", "public/css/head-foot.css"],
                        "/desttemp/public/css/kuantu.min.css": ["public/css/niuwah5.css", "public/css/kuantu.css"],
                        "/desttemp/public/css/h5reg.min.css": ["public/css/niuwah5.css", "public/css/h5reg.css"],
                        "/desttemp/public/css/toh5reg.min.css": ["public/css/base.css", "public/promo/css/toh5reg.css"],
                        "/desttemp/public/css/niubeidesc.min.css": ["public/css/niuwah5.css", "public/css/niubeidesc.css"],
                        "/desttemp/public/css/article.min.css": ["public/css/idialog.css", "public/css/article.css"],
                        "/desttemp/public/css/sjkh.min.css": ["public/css/idialog.css", "public/css/sjkh.css", "public/css/head-foot.css"],
                        "/desttemp/public/css/yiriceo.min.css": ["public/css/niuwah5.css"],
                        "/desttemp/public/css/ceo.min.css": ["public/css/niuwah5.css", "public/css/ceo.css"],
                        "/desttemp/public/css/hhr.min.css": ["public/css/idialog.css", "public/css/hhr.css", "public/css/sjkh.css", "public/css/head-foot.css"],
                        "/desttemp/public/css/smashingeggs.min.css": ["public/css/smashingeggs.css", "public/css/sjkh.css", "public/css/idialog.css", "public/css/head-foot.css"],
                        "/desttemp/public/css/huixiangshenghuo.min.css": ["public/css/idialog.css", "public/css/huixiangshenghuo.css", "public/css/sjkh.css", "public/css/head-foot.css"],
                        "/desttemp/public/css/tjhy.min.css": ["public/css/idialog.css", "public/css/tjhy.css", "public/css/sjkh.css", "public/css/head-foot.css"],
                        "/desttemp/public/css/niubeih5.min.css": ["public/css/niuwah5.css", "public/css/niubeih5_new.css"],
                        "/desttemp/public/css/spread.min.css": ["public/css/spread.css", "public/css/idialog.css"],
                        "/desttemp/public/css/mobiscroll.min.css": ["public/css/mobiscroll.css"],
                        "/desttemp/public/css/sdhd.min.css": ["public/css/niuwah5.css", "public/css/sdhd.css"],
                        "/desttemp/public/css/nx.min.css": ["public/css/niuwah5.css", "public/css/nx.css"],
                        "/desttemp/public/css/huishenghuo.min.css": ["public/css/sjkh.css", "public/css/head-foot", "public/css/huishenghuo.css"],
                        "/desttemp/public/css/jiaxi.min.css": ["public/css/niuwah5.css", "public/css/jiaxi.css"],
                        "/desttemp/public/css/jiaxi-join.min.css": ["public/css/niuwah5.css", "public/css/jiaxi-join.css"],
                        "/desttemp/public/css/jiaxipc.min.css": ["public/css/jiaxipc.css", "public/css/sjkh.css", "public/css/idialog.css", "public/css/head-foot.css"],
                        "/desttemp/public/css/m9/fengkong-status.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/fengkong-status.css"],
                        "/desttemp/public/css/m9/fenqifuwu-list.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/fenqifuwu-list.css"],
                        "/desttemp/public/css/m9/fenqifuwu-detail-app.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/fenqifuwu-detail-app.css"],
                        "/desttemp/public/css/m9/fenqifuwu-detail.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/fenqifuwu-detail.css"],
                        "/desttemp/public/css/m9/fenqifuwu-confirm.min.css": ["public/css/niuwah5.css", "public/css/niubeih5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/fenqifuwu-confirm.css"],
                        "/desttemp/public/css/m9/shenmeshitongxinrenzheng.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/shenmeshitongxinrenzheng.css"],
                        "/desttemp/public/css/m9/shoujirenzheng-status.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/shoujirenzheng-status.css"],
                        "/desttemp/public/css/m9/tongxinrenzheng.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/tongxinrenzheng.css"],
                        "/desttemp/public/css/m9/repay_success.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/niubeih5.css", "public/css/m9/repay_success.css"],
                        "/desttemp/public/css/m9/check_result.min.css": ["public/css/niuwah5.css", "public/css/m9/h5header.css", "public/css/m9/check_result.css"],
                        "/desttemp/public/css/m9/confirm_apply.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/confirm_apply.css"],
                        "/desttemp/public/css/m9/fenqifuwu_second.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/fenqifuwu_second.css"],
                        "/desttemp/public/css/m9/fuwu_check.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/fuwu_check.css"],

                        "/desttemp/public/css/m9/service_success.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/service_success.css"],









                        "/desttemp/public/css/yibaozhifu.min.css": ["public/css/niuwah5.css", "public/css/m9/yibaozhifu.css"],
                        "/desttemp/public/css/m11/tobind.min.css": ["public/css/base.css", "public/css/m11/tobind.css"],
                        "/desttemp/public/css/m11/yibao_bankcard.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m11/yibao_bankcard.css"],
                        "/desttemp/public/css/fudai.min.css": ["public/css/fudai.css"],
                        "/desttemp/public/css/guoqing.min.css": ["public/css/guoqing.css"],
                        "/desttemp/public/css/huixiangshenghuo_grid.min.css": ["public/css/idialog.css", "public/css/sjkh.css", "public/css/head-foot.css", "public/css/xsqg.css", "public/css/huixiangshenghuo_grid.css", "public/css/gotopicon.css"],
                        "/desttemp/public/css/hsh.min.css": ["public/css/hsh.css"],
                        '/desttemp/public/css/dfh.min.css': ['public/css/idialog.css', 'public/css/sjkh.css', 'public/css/dfh.css', 'public/css/head-foot.css'],
                        "/desttemp/public/css/xsqglist.min.css": ["public/css/idialog.css", "public/css/sjkh.css", "public/css/head-foot.css", "public/css/xsqg.css", "public/css/jquerygray/gray.min.css"],
                        "/desttemp/public/css/m9/fenqifuwu-confirm-apply.min.css": ["public/css/niuwah5.css", "public/css/niubeih5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/fenqifuwu-confirm-apply.css"],
                        "/desttemp/public/css/m9/repay_list.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/repay_list.css"],
                        "/desttemp/public/css/m9/repayment_details.min.css": ["public/css/niuwah5.css", "public/css/h5dialog.css", "public/css/m9/h5header.css", "public/css/m9/repayment_details.css", "public/css/niubeih5.css"],
                        "/desttemp/public/css/upgrade.min.css": ["public/css/niuwah5.css", "public/css/upgrade.css"],
                        "/desttemp/public/css/luckDraw.min.css": ["public/css/luckDraw.css"],
                        "/desttemp/public/css/fullpage.min.css": ["public/css/fullpage/global.css" , "public/fullpage/zepto.fullpage.css"],




                        "/desttemp/public/css/account.min.css": ["public/css/niuwah5.css","public/css/account.css"],
                        "/desttemp/public/css/userSign.min.css": ["public/css/userSign.css", "public/css/userSignCommon.css"],
                        "/desttemp/public/css/langdon/apply.min.css": ["public/css/base.css","public/css/langdon/apply.css"],
                        "/desttemp/public/css/langdon/auditing.min.css": ["public/css/niuwah5.css"],
                        "/desttemp/public/css/langdon/langdon.min.css": ["public/css/niuwah5.css"],
                        "/desttemp/public/css/langdon/plan.min.css": ["public/css/base.css","public/css/langdon/plan.css"],
                        "/desttemp/public/css/langdon/review.min.css": ["public/css/base.css","public/css/langdon/review.css"],
                        "/desttemp/public/css/langdon/success.min.css": ["public/css/base.css","public/css/langdon/success.css"],
                        "/desttemp/public/css/langdon/waitLoan.min.css": ["public/css/niuwah5.css"],




                        "/desttemp/public/css/jquery.fullpage.min.css": ["public/css/common/reset.css","public/jquery.fullpage/css/jquery.fullPage.css"],
                        "/desttemp/public/css/common/reset.min.css": ["public/css/common/reset.css"],
                        "/desttemp/public/css/zepto.fullPage.min.css": ["public/css/common/reset.css","public/css/fullpage/global.css","public/fullpage/zepto.fullpage.css"],
                        "/desttemp/public/css/nwusersign.min.css": ["public/css/userSignCommon.css","public/css/nwUserSign/usersign.css","public/css/animate.css"],
                        "/desttemp/public/css/thanksgivingday.min.css": ["public/css/thanksGiving_active.css","public/css/common/base.css"],
                    }
                }
            },
            processhtml: {
                release: {
                    files: [{
                        expand: true,
                        cwd: "views/",
                        src: ["**/*.html"],
                        dest: "/desttemp/views/"
                    }]
                }
            },
            copy: {
                release: {
                    files: [{
                        expand: true,
                        src: ["**"],
                        dest: "/desttemp/"
                    }]
                },
                releasedest: {
                    files: [{
                        expand: true,
                        src: ["**"],
                        cwd: "/desttemp/",
                        dest: "/niuwap2p5000/"
                    }]
                }
            },
            clean: {
                release: {
                    options: {
                        force: true
                    },
                    src: ["/desttemp/public/css/*.css", "/desttemp/test/", "!/desttemp/public/css/*.min.css",
                        "/desttemp/public/js/*.js", "!/desttemp/public/js/echarts", "!/desttemp/public/js/*.min.js",
                        "/desttemp/package.json", "/desttemp/Gruntfile.js", "/desttemp/config-testenv.js", "/desttemp/config-prodenv.js", "/desttemp/config-debug.js",
                        "/desttemp/node_modules/grunt*", "!/desttemp/public/js/libs/*"
                    ]
                },
                releasedest: {
                    options: {
                        force: true
                    },
                    src: ["/desttemp"]
                }
            },
            zip: {
                release: {
                    options: {
                        force: true
                    },
                    src: ["/niuwap2p5000/**"],
                    dest: zipname + ".zip"
                },
            }

        };
    };

    var timestamp = function() {
        var d = new Date();
        var dy = d.getFullYear();
        var dm = d.getMonth() + 1;
        if (dm < 10) {
            dm = "0" + dm;
        }
        var dd = d.getDate();
        if (dd < 10) {
            dd = "0" + dd;
        }
        var dh = d.getHours();
        if (dh < 10) {
            dh = "0" + dh;
        }
        var dmi = d.getMinutes();
        if (dmi < 10) {
            dmi = "0" + dmi;
        }
        /*var ds = d.getSeconds();
        if (ds < 10) {
          ds = "0" + ds;
        }
        var dms = d.getMilliseconds();
        if (dms < 10) {
          dms = "00" + dms;
        } else if (dms < 100) {
          dms = "0" + dms;
        }*/
        return dy + dm + dd + dh + dmi;
    };

    var generenConfigEnv = function(arr_task, filepath, fileName) {

        var dicName = "/" + fileName + timestamp() + "_500x";
        grunt.initConfig(config(dicName));

        var content = grunt.file.read(filepath, {
            encoding: "utf8"
        });
        var result = grunt.file.write("config.js", content);
        if (result) {
            grunt.log.write("config.js生成成功");
            grunt.task.run(arr_task);

        } else grunt.log.write("config.js生成失败");
    };

    //debug
    grunt.registerTask("debug", function() {
        generenConfigEnv(["copy:release", "uglify:release", "concat:release", "processhtml:release", "clean:release", "copy:releasedest", "clean:releasedest"], "config-debug.js", "niuwa_nodejs_debug_");

    });

    //test
    grunt.registerTask("test", function() {
        generenConfigEnv(["copy:release", "uglify:release", "concat:release", "processhtml:release", "clean:release", "copy:releasedest", "clean:releasedest", "zip:release"], "config-testenv.js", "niuwa_nodejs_test_");

    });
    //131
    grunt.registerTask("131", function() {
        generenConfigEnv(["copy:release", "uglify:release", "concat:release", "processhtml:release", "clean:release", "copy:releasedest", "clean:releasedest", "zip:release"], "config-131.js", "niuwa_nodejs_131_");

    });
    //203
    grunt.registerTask("203", function() {
        generenConfigEnv(["copy:release", "uglify:release", "concat:release", "processhtml:release", "clean:release", "copy:releasedest", "clean:releasedest", "zip:release"], "config-203.js", "niuwa_nodejs_203_");

    });
    //211
    grunt.registerTask("211", function() {
        generenConfigEnv(["copy:release", "uglify:release", "concat:release", "processhtml:release", "clean:release", "copy:releasedest", "clean:releasedest", "zip:release"], "config-211.js", "niuwa_nodejs_211_");
    });
    //215
    grunt.registerTask("215", function() {
        generenConfigEnv(["copy:release", "uglify:release", "concat:release", "processhtml:release", "clean:release", "copy:releasedest", "clean:releasedest", "zip:release"], "config-215.js", "niuwa_nodejs_215_");
    });
    //uat
    grunt.registerTask("uat", function() {
        generenConfigEnv(["copy:release", "uglify:release", "concat:release", "processhtml:release", "clean:release", "copy:releasedest", "clean:releasedest", "zip:release"], "config-uat.js", "niuwa_nodejs_uat_");
    });

    //PP
    grunt.registerTask('pp', function() {
        generenConfigEnv(['copy:release', 'uglify:release', 'concat:release', 'processhtml:release', 'clean:release', 'copy:releasedest', 'clean:releasedest', 'zip:release'], "config-pp.js", 'niuwa_nodejs_pp_');
    });

    //idctest
    grunt.registerTask('idctest', function() {
        generenConfigEnv(['copy:release', 'uglify:release', 'concat:release', 'processhtml:release', 'clean:release', 'copy:releasedest', 'clean:releasedest', 'zip:release'], "config-idctest.js", 'niuwa_nodejs_idctest_');
    });

    //release
    grunt.registerTask("default", function() {
        generenConfigEnv(["copy:release", "uglify:release", "concat:release", "processhtml:release", "clean:release", "copy:releasedest", "clean:releasedest", "zip:release"], "config-prodenv.js", "niuwa_nodejs_product_");
    });

};