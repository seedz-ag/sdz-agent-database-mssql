import connector from './src/connector'
class testes{
async teste(){
    const con = new connector('Server=localhost,1433;Database=master;User Id=SA;Password=Pass@word;Trusted_Connection=True;TrustServerCertificate=True;')
    const testes =     await con.connect();
    const execute = await testes.query(`select * from teste`)
    console.log(execute)
}
}

new testes().teste()