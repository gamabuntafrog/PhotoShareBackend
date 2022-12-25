

const changeAvatar = async (req, res) => {

    console.log(req.body)


    res.json({
        user: req.user
    })
}

module.exports = changeAvatar