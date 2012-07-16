

/** header **/

/**
header: {
	innerHeight: '84px',
	borderWidth: {
		top:    '1px',
		bottom: '1px',
	},
	shadow: {
		default: '0 0 10px 4px #2C2C2C',
		focus:   '0 0 10px 4px orange',
	},
	
	$space: this.innerHeight + this.borderWidth.top + this.borderWidth.bottom,
}
**/

header_innerHeight = 84
	&unit = px

header_border_top_width = 1
header_border_bottom_width = 1

header_shadow_default = 0 0 10px 4px #2C2C2C
header_shadow_focus = 0 0 10px 4px orange

header_space = ${header_innerHeight + header_border_top_width + header_border_bottom_width}
	&unit = px


zindex_header = 64



/** omnibox **/

omnibox_width = 38
	&unit = %
	
omnibox_height = ${header_innerHeight * (2/5)}
	&unit = px
	
omnibox_top = ${header_innerHeight*1/2 - omnibox_height * 1/2}
	&unit = px

omnibox_left = 12
	&unit = px
	
omnibox_padding_topOrBottom = 0
	&unit = px

omnibox_border_width = 1
	&unit = px
	
omnibox_border_color = black

omnibox_space = ${omnibox_height + omnibox_padding_topOrBottom + omnibox_border_width * 2}

zindex_omnibox = 128


/**

omnibox = {
	width:  '38px',
	height: header.innerHeight * (2/5),
	top:    (header.innerHeight * 0.5) - (this.height * 0.5),
	left:   '12px',
	padding: {
		top: 0,
		bottom: 0,
	},
	borderWidth: '1px',
	borderColor: 'black',
},

**/


/** omnibox results **/

omnibox_results_height = 200
	&unit = px

omnibox_results_border_top = 1px solid rgba(128,128,128,0.36)
omnibox_results_border = 1px solid grey

omnibox_results_padding = 6
	&unit = px


omnibox_results_border_bottom_width = 1
	&unit = px

omnibox_results_spaceY = ${omnibox_results_height + omnibox_results_border_bottom_width}


omnibox_results_border_leftAndRight_width = 1
	&unit = px

omnibox_results_shadow = 0 0 32px 4px black


header_corner_width = ${100 - omnibox_width}
	&unit = %
	


/** card **/

card_border_radius = 20px 40px 40px 40px


/** card deck_view transformation **/
card_deckview_rotation_x = 0
	&unit = deg
	
card_deckview_scale = 0.6


card_deckview_transform = rotateX( ${card_deckview_rotation_x}&unit ) scale( ${card_deckview_scale}&unit )


/** card deck_view:hover transformation **/
card_deckview_hover_rotation_z = -5
	&unit = deg

	
card_deckview_hover_scale = ${card_deckview_scale * 1.02}

card_deckview_hover_translate_x = -19
	&unit = px

card_deckview_hover_translate_y = -30
	&unit = px

card_deckview_hover_transform = rotateZ( ${card_deckview_hover_rotation_z}&unit ) scale( ${card_deckview_hover_scale} ) translate( ${card_deckview_hover_translate_x}&unit , ${card_deckview_hover_translate_y}&unit)



	
	
/** syntax prototype *
omnibox {
	width: 80px;
	height: ${header.innerHeight * (2/5))px;
	top: ${header.innerHeight * (1/2) - omnibox.height * (1/2))px;
	
	width: '80px',
	height: header.innerHeight,

}

omnibox_results {
	border: {
		bottom: {
			width: 0,
		}
	}
}

/****/