'use strict';

let outputBox = document.querySelector('output');

seqDialog.addEventListener('close', function onClose() {
    outputBox.value = seqDialog.returnValue + ' button clicked - ' + (new Date()).toString();
});

let creator_json_data = null;
let part_json_data = null;
let microphone_json_data = null;
let reverberation_json_data = null;

function selectChannel() {
    console.log('selectChannel : ' + channelSelector.value);
}

let selectedMotionState = null;
function selectSeq() {
    let obj = document.seqDialogForm.motionSelector;

    let index = obj.selectedIndex;
    if (index != 0) {
	console.log(obj.options[index].value);
    }
    selectedMotionState = obj.options[index].value;
    ShowMotion(obj.options[index].value);
}

function AppendContent(ul, title, value) {
    let li = document.createElement('div');
    li.textContent = title + ' : ' + value;
    li.style.cssText = 'margin: 5px 30px';
    ul.appendChild(li);
    return li;
}

function ShowMotion(condition) {
    let result = document.getElementsByClassName('motion');
    for (let k = 0; k < result.length; k++) {
	result[k].style.display = 'none';
    }
    result = document.getElementsByClassName(condition);
    for (let k = 0; k < result.length; k++) {
	result[k].style.display = 'block';
    }
//    console.log('ShowMtion: ' + condition);
}

function AddCreator() {
    let new_id = 1;
    if( creator_json_data != null) {
	new_id = creator_json_data.length  + 1;
    }
    let update_val = { 'id' : new_id, 'name' : '', 'affiliation' : '', 'email' : '', 'role' : '', 'license' : '' };
    if( creator_json_data != null) {
	creator_json_data.push(update_val);
    }
    else {
	creator_json_data = [ update_val ];
    }
    NewCreator(update_val);

    creatorAddMenu.remove();

    let menu = document.createElement('menu');
    menu.setAttribute('id', 'creatorAddMenu');
    creator.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddCreator();
    };
//    console.log('Add creator 1');
    btn.textContent = 'Add creator';
    menu.appendChild(btn);
}

function AddPart() {
    let new_id = 1;
    if( part_json_data != null) {
	new_id = part_json_data.length + 1;
	console.log(part_json_data);
	console.log('new_id = ' + new_id);
    }

    let update_val = { 'id': new_id, 'name' : '', 'amp': '1.0', 'file': [ ], 'sequence': [ ] };
    if( part_json_data != null) {
	part_json_data.push(update_val);
    }
    else {
	part_json_data = [ update_val ];
    }
    NewPart(update_val);
    partAddMenu.remove();

    let menu = document.createElement('menu');
    menu.setAttribute('id', 'partAddMenu');
    part.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddPart();
    };
    btn.textContent = 'Add part';
    menu.appendChild(btn);
}

function NewFile(part_id, data_file) {
    let ppp = document.getElementById('Part' + part_id + 'File');
    let ddd = document.createElement('div');
    ppp.appendChild(ddd);
    let ff_fileName = AppendContent(ddd, 'Name', data_file.name);
    let ff_audio = document.createElement('audio');
    ff_audio.setAttribute('id', 'Part' + part_id + 'audio');
    ff_audio.controls = true;
    ff_audio.preload = "auto";
    ddd.appendChild(ff_audio);
    let ff_channel = AppendContent(ddd, 'Channel', data_file.channel);
    let ff_start_time = AppendContent(ddd, 'Start time', data_file.start_time);
    let menu = document.createElement('menu');
    ddd.appendChild(menu)
    // File Edit Btn	    
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	if (typeof fileDialog.showModal === 'function') {
	    fileDialog.showModal();
	} else {
	    alert('The <dialog> API is not supported by this browser');
	}
	fileStartTime.value = data_file.start_time;
	fileOkBtn.onclick = function() {
	    if( wavFiles.files.length > 0 ) {
		data_file.name = wavFiles.files[0].name;
		ff_fileName.textContent = 'Name : ' + wavFiles.files[0].name;
		ff_audio.src = URL.createObjectURL(wavFiles.files[0]);
	    }
	    data_file.chennel = channelSelector.value;
	    data_file.start_time = fileStartTime.value;
	    ff_channel.textContent = 'Channel : ' + channelSelector.value;
	    ff_start_time.textContent = 'Start time : ' + fileStartTime.value;
	};
	wavFiles.onchange = function(e) {
	    let file = (e.target).files[0];
	    audioPlayer.src = URL.createObjectURL(file);
	    audioPlayer.pause();
	}    
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // File Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	part_json_data[part_id-1].file.splice(data_file.id-1, 1);
	for (let i = data_file.id-1; i < part_json_data[part_id-1].file.length; i++) {
	    let jj = i+1;
	    part_json_data[part_id-1].file[i].id = jj;
	}
	ddd.remove();
    };
    btn.textContent = 'Delete';
    menu.appendChild(btn);
}

function AddFile(part_id) {
    let new_id = 1;
    if( part_json_data[part_id-1].file != null) {
	new_id = part_json_data[part_id-1].file.length + 1;
    }
//    console.log('new_id = ' + new_id);

    let update_val = { 'id': new_id, 'name' : 'Not selected', 'channel' : '1', 'start_time':'0:0:0' };
    if( part_json_data[part_id-1].file != null) {
	part_json_data[part_id-1].file.push(update_val);
    }
    else {
	part_json_data[part_id-1].file = [ update_val ];
    }
    NewFile(part_id, update_val);
    let file_add = document.getElementById('Part' + part_id + 'FileAdd');
    file_add.remove();

    let menu = document.createElement('menu');
    menu.setAttribute('id', 'Part' + part_id + 'FileAdd');
    let file_id = document.getElementById('Part' + part_id + 'File');
    file_id.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddFile(part_id);
    };
    btn.textContent = 'Add file';
    menu.appendChild(btn);
}

function NewSequence(part_id, data_sequence) {
    let ddd = document.createElement('div');
//    console.log('Part' + part_id + 'Sequence');
    let ppp = document.getElementById('Part' + part_id + 'Sequence');
    ppp.appendChild(ddd);

    let seq_id = AppendContent(ddd, 'Id', data_sequence.id);
    let seq_id_name = 'Part' + part_id + 'SequenceId' + data_sequence.id;
    seq_id.setAttribute('id', seq_id_name);
    
    let seq_motion_time = AppendContent(ddd, 'Motion.Time', data_sequence.time);
    let seq_motion_state = AppendContent(ddd, 'Motion.State', data_sequence.motion.state);
    let sss = document.createElement('div');
    sss.setAttribute('id', 'MotionState'+data_sequence.id);
//    console.log('Create div : id=' + sss.id);
    
    ddd.appendChild(sss);
    if( data_sequence.motion.state == 'unmoving' )
    {
	AppendContent(sss, 'Position_radius', data_sequence.motion.polar_position.radius);
	AppendContent(sss, 'Position_azimuth', data_sequence.motion.polar_position.azimuth);
	AppendContent(sss, 'Position_elevation', data_sequence.motion.polar_position.elevation);
    }
    else if( data_sequence.motion.state == 'rotate' )
    {
	AppendContent(sss, 'Period_h', data_sequence.motion.period.h);
	AppendContent(sss, 'Period_v', data_sequence.motion.period.v);
    }
    else if( data_sequence.motion.state == 'moveto' )
    {
	AppendContent(sss, 'Position_radius', data_sequence.motion.polar_position.radius);
	AppendContent(sss, 'Position_azimuth', data_sequence.motion.polar_position.azimuth);
	AppendContent(sss, 'Position_elevation', data_sequence.motion.polar_position.elevation);
	AppendContent(sss, 'Duration', data_sequence.motion.duration);
    }
    let seq_comment = AppendContent(ddd, 'Motion.Comment', data_sequence.comment);
    let menu = document.createElement('menu');
    ddd.appendChild(menu)
    // Sequence Edit Btn
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Click Seq Edit', data_sequence.motion.state);
	if (typeof seqDialog.showModal === 'function') {
	    seqDialog.showModal();
	} else {
	    alert('The <dialog> API is not supported by this browser');
	}
	seqId.textContent = 'Id : ' + data_sequence.id;
	seqTime.value =  data_sequence.time;
	let select = motionSelector.options;
	for(let i = 0; i < select.length; i++ ){
	    if(select[i].value === data_sequence.motion.state){
		select[i].selected = true;
		break;
	    }
	}
	if( data_sequence.motion.state == 'unmoving' )
	{
	    posRadiusInput.value = data_sequence.motion.polar_position.radius;
	    posAzimuthInput.value = data_sequence.motion.polar_position.azimuth;
	    posElevationInput.value = data_sequence.motion.polar_position.elevation;
	}
	else if( data_sequence.motion.state == 'rotate' )
	{
	    periodHInput.value = data_sequence.motion.period.h;
	    periodVInput.value = data_sequence.motion.period.v;
	}
	else if( data_sequence.motion.state == 'moveto' )
	{
	    posRadiusInput.value = data_sequence.motion.polar_position.radius;
	    posAzimuthInput.value = data_sequence.motion.polar_position.azimuth;
	    posElevationInput.value = data_sequence.motion.polar_position.elevation;
	    durationInput.value = data_sequence.motion.duration;
	}
	seqComment.value = data_sequence.comment;
	
	ShowMotion(data_sequence.motion.state);

	seqOkBtn.onclick = function() {
	    let position_elem = null;
	    let position_val = null;
	    if( selectedMotionState == 'unmoving' )
	    {
		position_elem = 'polar_position';
		position_val = JSON.stringify({
		    'radius' : posRadiusInput.value,
		    'azimuth' : posAzimuthInput.value,
		    'elevation' : posElevationInput.value
		})
	    }
	    else if( selectedMotionState == 'rotate' )
	    {
		position_elem = 'period';
		position_val = JSON.stringify({
		    'h' : periodHInput.value,
		    'v' : periodVInput.value
		})
	    }
	    else if( selectedMotionState == 'moveto' )
	    {
		position_elem = 'polar_position';
		position_val = JSON.stringify({
		    'radius' : posRadiusInput.value,
		    'azimuth' : posAzimuthInput.value,
		    'elevation' : posElevationInput.value
		})
	    }
	    let motion_val = {
		'state' : selectedMotionState,
		position_elem : position_val
	    };
	    console.log(motion_val);
	    if( selectedMotionState == 'moveto' )
	    {
		motion_val['duration'] = durationInput.value;
		console.log(motion_val);
	    }

	    let update_val = JSON.stringify({
		'id' : data_sequence.id,
		'time' : seqTime.value,
		'motion' : motion_val,
		'comment' : seqComment.value
	    })
	    data_sequence.time = seqTime.value;
	    seq_motion_time.textContent = 'Motion.Time : ' + seqTime.value;
	    data_sequence.motion.state = selectedMotionState;
	    seq_motion_state.textContent = 'Motion.State : ' + selectedMotionState;

	    let m_state = document.getElementById('MotionState'+data_sequence.id);
//	    console.log('m_state.id = ' + m_state.id);
	    while(m_state.firstChild) {
		m_state.removeChild(m_state.firstChild);
	    }

	    if( data_sequence.motion.state == 'unmoving' )
	    {
		data_sequence.motion.polar_position = {
		    'radius' : parseFloat(posRadiusInput.value),
		    'azimuth' : parseFloat(posAzimuthInput.value),
		    'elevation' : parseFloat(posElevationInput.value)
		};
		AppendContent(m_state, 'Position_radius', data_sequence.motion.polar_position.radius);
		AppendContent(m_state, 'Position_azimuth', data_sequence.motion.polar_position.azimuth);
		AppendContent(m_state, 'Position_elevation', data_sequence.motion.polar_position.elevation);
	    }
	    else if( data_sequence.motion.state == 'rotate' )
	    {
		data_sequence.motion.period = {
		    'h' : parseFloat(periodHInput.value),
		    'v' : parseFloat(periodVInput.value)
		};
		AppendContent(m_state, 'Period_h', data_sequence.motion.period.h);
		AppendContent(m_state, 'Period_v', data_sequence.motion.period.v);
	    }
	    else if( data_sequence.motion.state == 'moveto' )
	    {
		data_sequence.motion.polar_position = {
		    'radius' : parseFloat(posRadiusInput.value),
		    'azimuth' : parseFloat(posAzimuthInput.value),
		    'elevation' : parseFloat(posElevationInput.value)
		};
		data_sequence.motion.duration = parseFloat(durationInput.value)
		AppendContent(m_state, 'Position_radius', data_sequence.motion.polar_position.radius);
		AppendContent(m_state, 'Position_azimuth', data_sequence.motion.polar_position.azimuth);
		AppendContent(m_state, 'Position_elevation', data_sequence.motion.polar_position.elevation);
		AppendContent(m_state, 'Duration', data_sequence.motion.duration);
	    }

	    data_sequence.comment = seqComment.value;
	    seq_comment.textContent = 'Motion.Comment : ' + seqComment.value;

//	    console.log('Sequence OK in Edit Dialog : ' + selectedMotionState);
	};
    };
    btn.textContent = 'Edit'
    menu.appendChild(btn)
    
    // Sequence Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Click Seq Delete', ddd);
	part_json_data[part_id-1].sequence.splice(data_sequence.id-1, 1);
	for (let i = data_sequence.id-1; i < part_json_data[part_id-1].sequence.length; i++) {
	    let jj = i+1;
	    let kk = i+2;
	    part_json_data[part_id-1].sequence[i].id = jj;
	    let seq_id_name = 'Part' + part_id + 'SequenceId' + kk;
	    let seq_id = document.getElementById(seq_id_name);
	    seq_id.textContent = 'Id : ' + jj;
	    seq_id.setAttribute('id', 'Part' + part_id + 'SequenceId' + jj);
	}
	ddd.remove();
    };
    btn.textContent = 'Delete';
    menu.appendChild(btn);
}

function AddSequence(part_id) {
    let new_id = 1;
    if( part_json_data[part_id-1].sequence != null) {
	new_id = part_json_data[part_id-1].sequence.length + 1;
    }
    let update_val = { 'id' : new_id, 'time':'0:0', 'motion':{}, 'comment' : '' };
    if( part_json_data[part_id-1].sequence != null) {
	part_json_data[part_id-1].sequence.push(update_val);
    }
    else {
	part_json_data[part_id-1].sequence = [ update_val ];
    }
    NewSequence(part_id, update_val);
    let seq_add = document.getElementById('Part' + part_id + 'SeqAdd');
    seq_add.remove();

    let menu = document.createElement('menu');
    menu.setAttribute('id', 'Part' + part_id + 'SeqAdd');
    let seq_id = document.getElementById('Part' + part_id + 'Sequence');
    seq_id.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddSequence(part_id);
    };
    btn.textContent = 'Add sequence';
    menu.appendChild(btn);
}

function AddMicrophone() {
    let new_id = 1;
    console.log('Debug 0');
    console.log(microphone_json_data);
    console.log('Debug 0.5');
    if( microphone_json_data != null) {
	new_id = microphone_json_data.length + 1;
    }
    console.log('AddMicrophone : new_id = ' + new_id);
    let update_val = { 'id': new_id, 'orthogonal_position':{ 'x':'0.0', 'y':'0.0', 'z':'0.0' }};
    if( microphone_json_data != null) {
	console.log(microphone_json_data);
	microphone_json_data.push(update_val);
    }
    else {
	microphone_json_data = [ update_val ];
    }
    console.log('Debug 1');
    console.log(microphone_json_data);
    NewMicrophone(update_val);
    microphoneAddMenu.remove();

    let menu = document.createElement('menu');
    menu.setAttribute('id', 'microphoneAddMenu');
    microphone.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddMicrophone();
    };
    btn.textContent = 'Add microphone';
    menu.appendChild(btn);
}

function AddReverberation() {
    let new_id = 1;
    if( reverberation_json_data != null) {
	new_id = reverberation_json_data.length + 1;
    }
//    console.log('new_id = ' + new_id);
    let update_val = { 'id': new_id, 'ir_fullpath': 'file name', 'amp':'1.0' };
    if( reverberation_json_data != null) {
	reverberation_json_data.push(update_val);
    }
    else {
	reverberation_json_data = [ update_val ];
    }
    NewReverberation(update_val);
    reverberationAddMenu.remove();

    let menu = document.createElement('menu');
    menu.setAttribute('id', 'reverberationAddMenu');
    reverberation.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddReverberation();
    };
    btn.textContent = 'Add reverberation';
    menu.appendChild(btn);
}

function NewCreator(data) {
    let ddd = document.createElement('div');
    creator.appendChild(ddd);

    let name = data.name;
    let affiliation = data.affiliation;
    let email = data.email;
    let role = data.role;
    let license = data.license;
    
    let cc_id = AppendContent(ddd, 'Id', data.id);
    cc_id.setAttribute('id', 'CreatorId' + data.id);
    let cc_name = AppendContent(ddd, 'Name', name);
    let cc_afili = AppendContent(ddd, 'Affiliation', affiliation);
    let cc_email = AppendContent(ddd, 'E-mail', email);
    let cc_role = AppendContent(ddd, 'Role', role);
    let cc_lic = AppendContent(ddd, 'License', license);

    let menu = document.createElement('menu');
    ddd.appendChild(menu)
    // Creator Edit Btn	    
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Creator Edit Click');
	if (typeof creatorDialog.showModal === 'function') {
	    creatorDialog.showModal();
	} else {
	    alert('The <dialog> API is not supported by this browser');
	}
	creatorName.value = data.name;
	creatorAffiliation.value = data.affiliation;
	creatorEmail.value = data.email;
	creatorRole.value = data.role;
	creatorLicense.value = data.license;
	creatorOkBtn.onclick = function() {
	    data.name = creatorName.value;
	    cc_name.textContent = 'Name : ' + creatorName.value;
	    data.affiliation = creatorAffiliation.value;
	    cc_afili.textContent = 'Affiliation : ' + creatorAffiliation.value;
	    data.email = creatorEmail.value;
	    cc_email.textContent = 'E-mail : ' + creatorEmail.value;
	    data.role = creatorRole.value;
	    cc_role.textContent = 'Role : ' + creatorRole.value;
	    data.license = creatorLicense.value;
	    cc_lic.textContent = 'License : ' + creatorLicense.value;
//	    console.log('ID:' + data.id + ' : Name : ' + data.name + ' --> ' + creatorName.value);
//	    console.log('Creator OK in Edit Dialog');
	};
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // Creator Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Creator Delete Click');
	creator_json_data.splice(data.id-1, 1);
	for (let i = data.id-1; i < creator_json_data.length; i++) {
	    let jj = i+1;
	    let kk = i+2;
	    creator_json_data[i].id = jj;
	    let ppp = document.getElementById('CreatorId'+kk);
	    ppp.textContent = 'Id : ' + jj;
	    ppp.setAttribute('id', 'CreatorId' + jj);
	}
	ddd.remove();
    };
    btn.textContent = 'Delete';
    menu.appendChild(btn);
}

function NewCreators(data) {
//    console.log(data);
    creator_json_data = data;
//    console.log('clear Creator Children');
    while(creator.firstChild) {
	creator.removeChild(creator.firstChild);
    }
    if( data != null ) {
	for (let i = 0; i < data.length; i++) {
	    NewCreator(data[i]);
	}
    }
    let sm = document.createElement('summary');
    sm.textContent = 'Creators';
    creator.appendChild(sm)
    // Creator Add Btn
    let menu = document.createElement('menu');
    menu.setAttribute('id', 'creatorAddMenu');
    creator.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddCreator();
    };
//    console.log('Add creator 2');
    btn.textContent = 'Add creator';
    menu.appendChild(btn);
}

function NewPart(data) {
    let ddd = document.createElement('div');
    part.appendChild(ddd);

    let pp_id = AppendContent(ddd, 'Id', data.id);
    pp_id.setAttribute('id', 'PartId' + data.id);
    
    let pp_name = AppendContent(ddd, 'Name', data.name);
    let pp_amp = AppendContent(ddd, 'Amp', data.amp);
    let li = document.createElement('details');
    li.setAttribute('id', 'Part' + data.id + 'File');
//    console.log('li.id = ' + li.id);

    li.addEventListener('toggle', function() {
	console.log('detailsEvent : ' + li.open);
    }, false);
    ddd.appendChild(li);
    let li1 = document.createElement('summary');
    li1.textContent = 'Files';
    li1.style.cssText = 'margin: 5px 30px';
    li.appendChild(li1);
    for (let j = 0; j < data.file.length; j++) {
	NewFile(data.id, data.file[j]);
    }
    // File Add Btn
    let menu = document.createElement('menu');
    menu.setAttribute('id', 'Part' + data.id + 'FileAdd');
    li.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddFile(data.id);
    };
    btn.textContent = 'Add file';
    menu.appendChild(btn);
    
    li = document.createElement('details');
    li.setAttribute('id', 'Part' + data.id + 'Sequence');
//    console.log('11:li.id = ' + li.id);
    ddd.appendChild(li);
    li1 = document.createElement('summary');
    li1.textContent = 'Sequences';
    li1.style.cssText = 'margin: 5px 30px';
    li.appendChild(li1);
    for (let j = 0; j < data.sequence.length; j++) {
	NewSequence(data.id, data.sequence[j]);
    }

    // Sequence Add Btn
    menu = document.createElement('menu');
    menu.setAttribute('id', 'Part' + data.id + 'SeqAdd');
    li.appendChild(menu)
    btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddSequence(data.id);
    };
    btn.textContent = 'Add sequence';
//    console.log('menu.id for appendChild = ' + menu.id);
    menu.appendChild(btn);

    // Part Edit Btn	    
    menu = document.createElement('menu');
    ddd.appendChild(menu)

    btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Part Edit Click');
	if (typeof partDialog.showModal === 'function') {
	    partDialog.showModal();
	} else {
	    alert('The <dialog> API is not supported by this browser');
	}
	partName.value =  data.name;
	partAmp.value =  data.amp;
	partOkBtn.onclick = function() {
	    data.name = partName.value;
	    pp_name.textContent = 'Name : ' + partName.value;
	    data.amp = partAmp.value;
	    pp_amp.textContent = 'Amp : ' + partAmp.value;
//	    console.log('Part OK in Edit Dialog');
	};
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // Part Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	part_json_data.splice(data.id-1, 1);
	for (let i = data.id-1; i < part_json_data.length; i++) {
	    let jj = i+1;
	    let kk = i+2;
	    part_json_data[i].id = jj;
	    let ppp = document.getElementById('PartId'+kk);
	    ppp.textContent = 'Id : ' + jj;
	    ppp.setAttribute('id', 'PartId' + jj);
	}
	ddd.remove();
    };
    btn.textContent = 'Delete';
    menu.appendChild(btn);
}

function NewParts(data) {
//    console.log(data);
    part_json_data = data;
//    console.log('clearParts Children');
    while(part.firstChild) {
	part.removeChild(part.firstChild);
    }
    if( data != null ) {
	for (let i = 0; i < data.length; i++) {
	    NewPart(data[i]);
	}
    }
    let sm = document.createElement('summary');
    sm.textContent = 'Parts';
    part.appendChild(sm)
    // Part Add Btn
    let menu = document.createElement('menu');
    menu.setAttribute('id', 'partAddMenu');
    part.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddPart();
    };
    btn.textContent = 'Add part';
    menu.appendChild(btn);
}

function NewMicrophone(data) {
    let ddd = document.createElement('div');
    microphone.appendChild(ddd);
    
    let pp_id = AppendContent(ddd, 'Id', data.id);
    pp_id.setAttribute('id', 'MicrophoneId' + data.id);
    let pp_x = AppendContent(ddd, 'Orthogonal_position.x', data.orthogonal_position.x);
    let pp_y = AppendContent(ddd, 'Orthogonal_position.y', data.orthogonal_position.y);
    let pp_z = AppendContent(ddd, 'Orthogonal_position.z', data.orthogonal_position.z);
    let menu = document.createElement('menu');
    ddd.appendChild(menu)
    // Mic Edit Btn	    
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Mic Edit Click');
	if (typeof micDialog.showModal === 'function') {
	    micDialog.showModal();
	} else {
	    alert('The <dialog> API is not supported by this browser');
	}
	micPositionX.value =  data.orthogonal_position.x;
	micPositionY.value =  data.orthogonal_position.y;
	micPositionZ.value =  data.orthogonal_position.z;
	micOkBtn.onclick = function() {
	    data.orthogonal_position.x =  micPositionX.value;
	    data.orthogonal_position.y =  micPositionY.value;
	    data.orthogonal_position.z =  micPositionZ.value;
	    pp_x.textContent = 'Orthogonal_position.x : ' + micPositionX.value;
	    pp_y.textContent = 'Orthogonal_position.y : ' + micPositionY.value;
	    pp_z.textContent = 'Orthogonal_position.z : ' + micPositionZ.value;
	};
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // Mic Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Mic Delete Click');
	microphone_json_data.splice(data.id-1, 1);
	for (let i = data.id-1; i < microphone_json_data.length; i++) {
	    let jj = i+1;
	    let kk = i+2;
	    microphone_json_data[i].id = jj;
	    let ppp = document.getElementById('MicrophoneId'+kk);
	    ppp.textContent = 'Id : ' + jj;
	    ppp.setAttribute('id', 'MicrophoneId' + jj);
	}
	ddd.remove();
    };
    btn.textContent = 'Delete';
    menu.appendChild(btn);
}

function NewMicrophones(data) {
    microphone_json_data = data;
//    console.log(data);
//    console.log('clearMicrophone Children');
    while(microphone.firstChild) {
	microphone.removeChild(microphone.firstChild);
    }
    if( data != null ) {
	for (let i = 0; i < data.length; i++) {
	    NewMicrophone(data[i]);
	}
    }
    let sm = document.createElement('summary');
    sm.textContent = 'Microphones';
    microphone.appendChild(sm)
    // Microphone Add Btn
    let menu = document.createElement('menu');
    menu.setAttribute('id', 'microphoneAddMenu');
    microphone.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddMicrophone();
    };
    btn.textContent = 'Add microphone';
    menu.appendChild(btn);
}

function NewReverberation(data) {
    let ddd = document.createElement('div');
    reverberation.appendChild(ddd);

    let pp_id = AppendContent(ddd, 'Id', data.id);
    pp_id.setAttribute('id', 'ReverberationId' + data.id);
    let pp_ir_fp = AppendContent(ddd, 'ir_fullpath', data.ir_fullpath);
    let pp_amp = AppendContent(ddd, 'amp', data.amp);
    let menu = document.createElement('menu');
    ddd.appendChild(menu)
    // Rev Edit Btn	    
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Rev Edit Click');
	if (typeof revDialog.showModal === 'function') {
	    revDialog.showModal();
	} else {
	    alert('The <dialog> API is not supported by this browser');
	}
	revIRFN.value = data.ir_fullpath;
	revAmp.value = data.amp;
	revOkBtn.onclick = function() {
	    data.ir_fullpath = revIRFN.value;
	    data.amp = revAmp.value;
	    pp_ir_fp.textContent = 'ir_fullpath : ' + revIRFN.value;
	    pp_amp.textContent = 'Amp : ' + revAmp.value;
	};
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // Rev Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
//	console.log('Rev Delete Click');
	reverberation_json_data.splice(data.id-1, 1);
	for (let i = data.id-1; i < reverberation_json_data.length; i++) {
	    let jj = i+1;
	    let kk = i+2;
	    reverberation_json_data[i].id = jj;
	    let ppp = document.getElementById('ReverberationId'+kk);
	    ppp.textContent = 'Id : ' + jj;
	    ppp.setAttribute('id', 'ReverberationId' + jj);
	}
	ddd.remove();
    };
    btn.textContent = 'Delete';
    menu.appendChild(btn);
}

function NewReverberations(data) {
    reverberation_json_data = data;
//    console.log(data);
//    console.log('clear Reverberation Children');
    while(reverberation.firstChild) {
	reverberation.removeChild(reverberation.firstChild);
    }
    if( data != null ) {
	for (let i = 0; i < data.length; i++) {
	    NewReverberation(data[i]);
	}
    }
    let sm = document.createElement('summary');
    sm.textContent = 'Reverberations';
    reverberation.appendChild(sm)
    // Reverberation Add Btn
    let menu = document.createElement('menu');
    menu.setAttribute('id', 'reverberationAddMenu');
    reverberation.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.onclick= function() {
	AddReverberation();
    };
    btn.textContent = 'Add reverberation';
    menu.appendChild(btn);
}

function export2txt() {
    const a = document.createElement('a');
    let output = {
	'creator' : creator_json_data,
	'part' : part_json_data,
	'microphone' : microphone_json_data,
	'reverberation' : reverberation_json_data
    };
    a.href = URL.createObjectURL(new Blob([JSON.stringify(output, null, 2)], {
    type: 'application/json'
    }));
    
    a.setAttribute('download', saveFileName.value);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

load.onclick = function() {
    var files = loadFiles.files;
//    console.log(files);
    if (files.length <= 0) {
	return false;
    }

    var fr = new FileReader();

    fr.onload = function(e) {
	var result = JSON.parse(e.target.result);
//	console.log('clearData 1');
	clearData();
	NewCreators(result['creator']);
	NewParts(result['part']);
	NewMicrophones(result['microphone']);
	NewReverberations(result['reverberation']);
    }
    
    fr.readAsText(files.item(0));
};

clearData();

function clearData() {
    NewCreators(null);
    NewParts(null);
    NewMicrophones(null);
    NewReverberations(null);
}
