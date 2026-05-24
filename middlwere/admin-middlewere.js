const adminMiddlwere=(req,res,next)=>{
    try {
        const isAdminRole=req.user?.isAdmin
        if(!isAdminRole){
               return res.status(403).json({ msg: "Access denied — Admins only lodeycd" })
        }
        next()
    } catch (error) {
        next(error)
    }
}
module.exports=adminMiddlwere