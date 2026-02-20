const getRedirectPath = (role) =>{
        if(role === "ADMIN") return "/sys-admin";
        if(role === "NGO_ADMIN") return "/admin/dashboard";
        if(role === "USER") return "/"
        return "/login";
}

export default getRedirectPath;