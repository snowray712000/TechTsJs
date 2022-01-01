var aaaM = require('./aaa')

describe ( 'test1' , () => {
    it ('aaa', () => {
        expect(2).toBe(2)
        expect ( aaaM.aaa() ).toBe( 5 ) // 故意錯
    })
} )