/**
 * ConvertDateFromODataTime
 *
 * @param dateString date string, format is /Date(1512691200000)/
 */
export declare function ConvertDateFromODataTime(dateString?: string): Date;
/**
 * FormatODataDateTimedate
 *
 * format date to /Date(1512691200000)/ format
 */
export declare function FormatODataDateTimedate(date?: Date): string;
export declare function GetAuthorizationPair(user: string, password: string): {
    Authorization: string;
};
