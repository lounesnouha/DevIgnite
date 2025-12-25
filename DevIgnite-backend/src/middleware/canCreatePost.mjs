
const VALID_DEPARTMENTS = ["DEV", "UIUX", "DESIGN", "HR", "COM", "RELV"];

export const canCreatePost = (req, res, next)=>{

    const {role, department: userDepartment} = req.user;
    const {department: postDepartment} = req.body;

    if (!VALID_DEPARTMENTS.includes(postDepartment)) {
        return res.status(400).json({ msg: "Invalid department" });
    }

    if (role === "member")
        return res.status(403).json({msg: "Members are not allowed to post"});
    if (role === "manager" || role === "assistant_manager"){
        if (userDepartment !== postDepartment) 
            return res.status(403).json({msg: "You can only post in your own department feed"});
    }
    next();
}