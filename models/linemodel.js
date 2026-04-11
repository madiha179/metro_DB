const mongoose=require('mongoose');

const LineSchema=new mongoose.Schema({
    name:{
        type: String, 
        required:[true,'The line name is required'],
        lowercase: true
    },
    line_number: {
        type: Number,
        required:[true,'The line number is required'],
        unique: true,
        min: 1,
    },
    stations:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Station',
        }
    ],
    station_description: {
        type: String,
        required:[true,'The station description is required'],
    }  
});
LineSchema.virtual('station_count').get(function(){
    return this.stations.length
});
LineSchema.set('toJSON',{virtuals:true});
LineSchema.set('toObject',{virtuals:true})
const Line = mongoose.model('Line', LineSchema);
module.exports = Line;