

export class StringUtil {

    public static lefttrim(s,c) {
        var index = s.indexOf('0');
        
        while (index == 0) {
            // console.log(index);
            s = s.substr(1,s.length-1);
            // console.log(s);
            index = s.indexOf('0');
            if (index!=0) {
                break;
            }
        }
        return s;
    }

    public static formatSAPItemNo(in_sap_no) {
        var out_sap_no = in_sap_no.substr(0,in_sap_no.length-1)
        out_sap_no = StringUtil.lefttrim (out_sap_no, '0');
        return out_sap_no;
    }
}