module.exports = {
    getIndex: (req,res)=>{
        
        return res.json(req.user)
        
    }
}