const respond = (res, status, message, data = {}) => {
    const successCodes = [200, 201,]

    return res.status(status).send({
        status: successCodes.includes(status) ? 'success' : 'error',
        message,
        data,
    })

}

module.exports = respond
