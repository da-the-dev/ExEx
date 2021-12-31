//
//                     ***Credit to MotiveSoft!***
// https://github.com/Motivesoft/vscode-uuid-generator/blob/main/src/extension.ts
//      ***Thank you for using MIT Licence and making code free-to-use!***


export function createUUID() {
    let result: string
    let i: string
    let j: number
    let n: number

    // 32-digit hex number in the style:
    // 	xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
    // Where:
    //  M shall be 4 to indicate this as a Version 4 (random) UUID
    //  N shall be 10 (binary) to indicate this as a Variant 1

    // See https://www.ietf.org/rfc/rfc4122.txt, section 4.4

    // We're going to use a random number generator, but then introduce a time
    // influence to make sure we don't get caught up in some duplication issue
    // related to the pseudo-random number generator
    var dt = new Date().getTime()

    // Build this up over the course of this method
    result = ""

    // Generate each digit individually
    for (j = 0; j < 32; j++) {
        // Create the next 4 bit number for the overall string.
        // 4 bits = decimal 0-15, hex digit 0-F, binary 0000-1111

        if (j === 12)
            // Set 'M' to version 4 (0100 binary)
            // This occupies all 4 bits, so we replace the whole value
            n = 0x04

        else {
            // Work out the next hex digit (random number + some ad-hoc part of a timestamp modulo 16)
            n = Math.floor(dt + Math.random() * 16) % 16

            // Work through the timestamp value by modifying it until it is exhausted
            dt = Math.floor(dt / 16)

            if (j === 16) {
                // Set 'N' to variant 1 (10xx binary)
                // This occupies the top 2 bits only, so mask and replace them 
                n &= 0x03
                n |= 0x08
            }
        }

        // Format the string with hyphens for legibility
        if (j === 8 || j === 12 || j === 16 || j === 20)
            result = result + '-'


        // Add the hex digit to the result
        i = n.toString(16)
        result = result + i
    }

    // Return the result
    return result.toLowerCase()
}