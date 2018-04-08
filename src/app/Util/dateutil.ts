import { StringUtil } from "./stringutil";



export class DateUtil {

    /** Input: dd/mm/yyyy
     *  Output: type=date with GMT+7 Timezone
     *  Weeraya 08/04/2018
     */
    public static toInternalDate(in_display_date) {
        var mydate = in_display_date.split('/');
        var date = new Date (mydate[2],mydate[1]-1,mydate[0]) ;

        return date;
    }

    /** Input: Date yyyy-MM-ddTHH:mm:ssz
     *  Output: dd/mm/yyyy
     *  Weeraya 08/04/2018
     */
    public static toDisplayDate(in_date: Date) {
        var mydate = new Date(in_date);

        // console.log('mydate : ' + mydate);
        // console.log(mydate.toISOString());

        var mydisplaydate = [];
        mydisplaydate[0] = StringUtil.padleft(mydate.getDate(),'0',2);
        mydisplaydate[1] = StringUtil.padleft(mydate.getMonth() + 1,'0',2);
        mydisplaydate[2] = mydate.getFullYear();

        // console.log('mydisplaydate: ' + mydisplaydate);

        return mydisplaydate.join('/');
    }

    /** Input: Date yyyy-MM-ddTHH:mm:ssz
     *  Output: dd/mm/yyyy HH:mm:ss
     *  Weeraya 08/04/2018
     */
    public static toDisplayDateTime(in_date: Date) {
        var mydate = new Date(in_date);
        var mydisplaytime = [];
        mydisplaytime[0] = StringUtil.padleft(mydate.getHours(),'0',2);
        mydisplaytime[1] = StringUtil.padleft(mydate.getMinutes(),'0',2);
        mydisplaytime[2] = StringUtil.padleft(mydate.getSeconds(),'0',2);

        return [DateUtil.toDisplayDate(in_date),mydisplaytime.join(':')].join(' ');
    }
}