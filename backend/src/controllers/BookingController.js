const Booking = require('../models/Booking');

module.exports = {
    async store(req, res){
        const { user_id } = req.headers;
        const { spot_id } = req.params;
        const { date } = req.body;

        const booking = await Booking.create({
            user: user_id,
            spot: spot_id,
            date,
        });

        await booking.populate('spot').populate('user').execPopulate();

        //verifica se o dono está na requisição com o array de usuarios logados
        const ownerSocket = req.connectedUsers[booking.spot.user];
        //se a variavel for diferente de undefined -> ou seja, tem conteudo
        if(ownerSocket){
            //ela envia para o dono logado as informacoes do agendamento
            req.io.to(ownerSocket).emit('booking_request', booking);
        }

        return res.json(booking);
    }
}