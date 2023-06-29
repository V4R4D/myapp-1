export const validEmail = new RegExp(
    '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
 );
export const validPass = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');
// export const validPass = new RegExp('/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(paswrd)');
export const validName = new RegExp("^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$");
export const validsalary = new RegExp("^[0-9]{1,6}$");