export const regex = {
  email: {
    DOMAIN_NAME: /(?<=@)[^.]+(?=\.|(?=$))/,
    LOCAL_PART: /((?<!@)^(\w+|\.)+)/,
    SPECIAL: /[^a-zA-Z\x7f-\xff]/g,
    TLD: /(\.+\w+)?(\.+\w+)$/,
  },
  phone: {
    COUNTRY_CODE: /^(?<prefix>\+|00)(?<country>[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)?/g,
    INTERNATIONAL_PHONE_NUMBER: /^(?<prefix>\+|00)(?<country>[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)(?:\(0\))?(?<number>\d{6,14})$/,
    LOCAL_PHONE_NUMBER: /^0+\d{9}$/,
  },
};