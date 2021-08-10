/*
 * This regular expression can match passwords that meet the following conditions
    Must be 5-20 characters long
    Must contain at least one lower-case letter 
    Must contain at least one number (0123456789)
    Must not contain a colon (:); an ampersand (&); a period (.); a tilde (~); or a space.
 * Source: https://stackoverflow.com/questions/16965953/regular-expressions-for-username-and-password
 */
export const USER_PASS_REGEX = /^(?=[^a-z]*[a-z])(?=\D*\d)[^:&.~\s]{5,20}$/gm;

export const USER_NAME_REGEX = /^[a-z][a-z0-9-_]{3,32}$/gm;
