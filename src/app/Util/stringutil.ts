

export class StringUtil {

    /** Input: string, charactor to be trimmed
     *  Output: trimmed string
     *  Weeraya 08/04/2018
     */
    public static lefttrim(s, c): string {
        var index = s.indexOf('0');

        while (index == 0) {
            // console.log(index);
            s = s.substr(1, s.length - 1);
            // console.log(s);
            index = s.indexOf('0');
            if (index != 0) {
                break;
            }
        }
        return s;
    }

    /** Input: number, charactor to be padded, length
     *  Output: padded string
     *  Weeraya 08/04/2018
     */
    public static padleft(s: number, c, l): string {
        var ss = s.toString();

        if (ss.length >= l) { return ss; }

        while (ss.length < l) {
            ss = c + '' + ss;
            // console.log('s : ' + ss);

            if (ss.length >= l) {
                // console.log('ss : ' + ss);
                return ss;
            }
        }
    }

    /** Input: sap item no eg. 00010
     *  Output: 1
     *  Weeraya 08/04/2018
     */
    public static formatSAPItemNo(in_sap_no): string {
        var out_sap_no = in_sap_no;//.substr(0, in_sap_no.length - 1)
        out_sap_no = StringUtil.lefttrim(out_sap_no, '0');
        return out_sap_no;
    }


    
}