
/**
 * 全局的一些函数
 */
class MyDetails {
    /**
     * 随机生成全局唯一标识符
     */
    newGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }

}

export default new MyDetails();