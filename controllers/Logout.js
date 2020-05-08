exports.logout = function (req,res) {
    //删除sesshion req.session {s_id:'yuru'}
    delete req.session['s_id'];
    res.redirect('/login');
}
