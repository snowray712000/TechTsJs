import { aaa } from "./aaa"

describe ( 'aaa' , () => {
    it ('bbb', () => {
        expect( 5 ).toBe( 5 )
        expect( aaa() ).toBe( 5 ) 
    })
})