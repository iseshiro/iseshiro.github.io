'use strict';

let creator_json_data = null;
let part_json_data = null;
let microphone_json_data = null;
let reverberation_json_data = null;

let stream_word_count = 0;
let wavdata;
let selectedFile;
let selectedEndtime = 0.0;
let img_side = new Image();
img_side.src = './img/side.png';
let img_above = new Image();
img_above.src = './img/above.png';
const red_circle_distance = 1.5;

function displayMain(disp) {
    let result = document.getElementsByClassName('mainButton');
    let k = 0;
    for (k = 0; k < result.length; k++) {
	result[k].disabled = disp;
    }
    result = document.getElementsByClassName('mainInput');
    for (k = 0; k < result.length; k++) {
	result[k].disabled = disp;
    }
}

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

    let menu = document.createElement('div');
    menu.setAttribute('id', 'creatorAddMenu');
    creator.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddCreator();
	return false;
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

    let menu = document.createElement('div');
    menu.setAttribute('id', 'partAddMenu');
    part.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddPart();
	return false;
    };
    btn.textContent = 'Add part';
    menu.appendChild(btn);
}

function NewFile(part_id, data_file) {
    let ppp = document.getElementById('Part' + part_id + 'File');
    let ddd = document.createElement('div');
    ppp.appendChild(ddd);

    let ff_wavinput_form = document.createElement('form');
    ff_wavinput_form.setAttribute('id', 'Part' + part_id + 'wavfile' + data_file.id);
    console.log('file id : ' + 'Part' + part_id + 'wavfile' + data_file.id);
    ddd.appendChild(ff_wavinput_form);

    let ff_file_select = document.createElement('div');
    ff_file_select.style.display = 'flex';
    ff_wavinput_form.appendChild(ff_file_select);

    let ff_wavinput_label = document.createElement('label');
    ff_wavinput_label.setAttribute('id', 'file_upload_label');
    ff_wavinput_label.setAttribute('for', 'file_upload_input');
    ff_wavinput_label.innerHTML = "Select File";    
    ff_file_select.appendChild(ff_wavinput_label);
    
    let ff_wavinput = document.createElement('input');
    ff_wavinput.setAttribute('id', 'file_upload_input');
    ff_wavinput.setAttribute('name', 'file');
    ff_wavinput.setAttribute('type', 'file');

    let ff_file_name = document.createElement('div');
    ff_file_name.textContent = data_file.name;
    ff_file_name.style.cssText = 'margin: 15px 15px 5px 5px';
    ff_file_select.appendChild(ff_file_name);
    ff_wavinput_label.appendChild(ff_wavinput);
    
    let ff_channel = AppendContent(ddd, 'Channel', data_file.channel);
    let ff_start_time = AppendContent(ddd, 'Start time', data_file.start_time);
    let ff_end_time = AppendContent(ddd, 'End time', data_file.end_time);
    let menu = document.createElement('div');
    ddd.appendChild(menu);

    ff_wavinput.addEventListener('change' , function() {
	WavFileRead(ff_wavinput.files, ff_end_time, data_file);
	let filename = ff_wavinput.files[0].name;
	ff_file_name.textContent = filename
	selectedFile = ff_wavinput.files[0];
	data_file.name = filename;
    }, false);
    
    // File Edit Btn	    
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	fileDialog.style.display = 'block';
	fileStartTime.value = data_file.start_time;
	fileEndTime.value = data_file.end_time;
	let ff_rect = ff_channel.getBoundingClientRect();
	fileDialog.style.top = (document.documentElement.scrollTop + ff_rect.y) + "px";
	displayMain(true);
	fileOkBtn.onclick = function() {
	    data_file.channel = channelSelector.value;
	    data_file.start_time = fileStartTime.value;
	    data_file.end_time = fileEndTime.value;
	    ff_channel.textContent = 'Channel : ' + channelSelector.value;
	    ff_start_time.textContent = 'Start time : ' + fileStartTime.value;
	    ff_end_time.textContent = 'End time : ' + fileEndTime.value;
	    fileDialog.style.display = 'none';
	    displayMain(false);
	    return false;
	};
	fileCancelBtn.onclick = function() {
	    fileDialog.style.display = 'none';
	    displayMain(false);
	}
	return false;
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // File Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	part_json_data[part_id-1].file.splice(data_file.id-1, 1);
	for (let i = data_file.id-1; i < part_json_data[part_id-1].file.length; i++) {
	    let jj = i+1;
	    part_json_data[part_id-1].file[i].id = jj;
	}
	ddd.remove();
	return false;
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

    const update_val = { 'id': new_id, 'name' : 'Not selected', 'channel' : '1', 'start_time':'0', 'end_time':'0' };
    if( part_json_data[part_id-1].file != null) {
	part_json_data[part_id-1].file.push(update_val);
    }
    else {
	part_json_data[part_id-1].file = [ update_val ];
    }
    NewFile(part_id, update_val);
    let file_add = document.getElementById('Part' + part_id + 'FileAdd');
    file_add.remove();

    let menu = document.createElement('div');
    menu.setAttribute('id', 'Part' + part_id + 'FileAdd');
    let file_id = document.getElementById('Part' + part_id + 'File');
    file_id.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddFile(part_id);
	return false;
    };
    btn.textContent = 'Add file';
    menu.appendChild(btn);
}

function NewSequence(part_id, data_sequence) {
    let ddd = document.createElement('div');
    ddd.addEventListener('mouseover', function() {
	ddd.style.backgroundColor = 'lightyellow';
	DrawSequence(part_id, data_sequence.id, true);
    }, false);
    ddd.addEventListener('mouseout', function() {
	ddd.style.backgroundColor = 'white';
	DrawSequence(part_id, data_sequence.id, false);
    }, false);

//    console.log('Part' + part_id + 'Sequence');
    let ppp = document.getElementById('Part' + part_id + 'Sequence');
    ppp.appendChild(ddd);

    let seq_id = AppendContent(ddd, 'Id', data_sequence.id);
    let seq_id_name = 'Part' + part_id + 'SequenceId' + data_sequence.id;
    seq_id.setAttribute('id', seq_id_name);
    
    let seq_motion_time = AppendContent(ddd, 'Motion.Time', data_sequence.time);
    let seq_motion_state = AppendContent(ddd, 'Motion.State', data_sequence.motion.state);
    let sss = document.createElement('div');
    sss.setAttribute('id', 'Part' + part_id + 'MotionState'+data_sequence.id);
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
	AppendContent(sss, 'Cycle_h', data_sequence.motion.cycle.h);
	AppendContent(sss, 'Cycle_v', data_sequence.motion.cycle.v);
    }
    else if( data_sequence.motion.state == 'moveto' )
    {
	AppendContent(sss, 'Position_radius', data_sequence.motion.polar_position.radius);
	AppendContent(sss, 'Position_azimuth', data_sequence.motion.polar_position.azimuth);
	AppendContent(sss, 'Position_elevation', data_sequence.motion.polar_position.elevation);
	AppendContent(sss, 'Duration', data_sequence.motion.duration);
    }
    else if( data_sequence.motion.state == 'random' )
    {
	AppendContent(sss, 'Duration', data_sequence.motion.duration);
    }
    let seq_comment = AppendContent(ddd, 'Motion.Comment', data_sequence.comment);
    let menu = document.createElement('div');
    ddd.appendChild(menu)
    // Sequence Edit Btn
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function(e) {
	e.stopPropagation();
	//	console.log('Click Seq Edit', data_sequence.motion.state);
	seqDialog.style.display = 'block';
	seqId.textContent = 'Id : ' + data_sequence.id;
	seqTime.value =  data_sequence.time;
	let select = motionSelector.options;
	select[0].selected = true;
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
	    cycleHInput.value = data_sequence.motion.cycle.h;
	    cycleVInput.value = data_sequence.motion.cycle.v;
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
	const seq_rect = seq_motion_time.getBoundingClientRect();
	seqDialog.style.top = (document.documentElement.scrollTop + seq_rect.y) + "px";
	displayMain(true);
	seqOkBtn.onclick = function() {
/*	    let position_elem = null;
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
		position_elem = 'cycle';
		position_val = JSON.stringify({
		    'h' : cycleHInput.value,
		    'v' : cycleVInput.value
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
	    if( selectedMotionState == 'moveto' ||  selectedMotionState == 'random' )
	    {
		let motion_val = {
		    'state' : selectedMotionState,
		    position_elem : position_val
		};
		motion_val['duration'] = durationInput.value;
	    }*/

	    data_sequence.time = seqTime.value;
	    seq_motion_time.textContent = 'Motion.Time : ' + seqTime.value;
	    data_sequence.motion.state = selectedMotionState;
	    seq_motion_state.textContent = 'Motion.State : ' + selectedMotionState;

	    let m_state = document.getElementById('Part' + part_id + 'MotionState'+data_sequence.id);
	    console.log('m_state.id = ' + m_state.id);
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
		data_sequence.motion.cycle = {
		    'h' : parseFloat(cycleHInput.value),
		    'v' : parseFloat(cycleVInput.value)
		};
		AppendContent(m_state, 'Cycle_h', data_sequence.motion.cycle.h);
		AppendContent(m_state, 'Cycle_v', data_sequence.motion.cycle.v);
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
	    else if( data_sequence.motion.state == 'random' )
	    {
		data_sequence.motion.duration = parseFloat(durationInput.value)
		AppendContent(m_state, 'Duration', data_sequence.motion.duration);
	    }

	    data_sequence.comment = seqComment.value;
	    seq_comment.textContent = 'Motion.Comment : ' + seqComment.value;

	    MakeMotion(part_id);
	    DrawMotion();
	    
	    seqDialog.style.display = 'none';
	    displayMain(false);
	    return false;
	};
	seqCancelBtn.onclick = function() {
	    seqDialog.style.display = 'none';
	    displayMain(false);
	}
    };
    btn.textContent = 'Edit'
    menu.appendChild(btn)
    
    // Sequence Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
//	console.log('Click Seq Delete', ddd);
	part_json_data[part_id-1].sequence.splice(data_sequence.id-1, 1);
	for (let i = data_sequence.id-1; i < part_json_data[part_id-1].sequence.length; i++) {
	    const jj = i+1;
	    const kk = i+2;
	    part_json_data[part_id-1].sequence[i].id = jj;
	    const seq_id_name = 'Part' + part_id + 'SequenceId' + kk;
	    let seq_id = document.getElementById(seq_id_name);
	    seq_id.textContent = 'Id : ' + jj;
	    seq_id.setAttribute('id', 'Part' + part_id + 'SequenceId' + jj);
	}
	ddd.remove();
	return false;
    };
    btn.textContent = 'Delete';
    menu.appendChild(btn);
}

function AddSequence(part_id) {
    let new_id = 1;
    if( part_json_data[part_id-1].sequence != null) {
	new_id = part_json_data[part_id-1].sequence.length + 1;
    }
    const update_val = { 'id' : new_id, 'time':'0', 'motion':{}, 'comment' : '' };
    if( part_json_data[part_id-1].sequence != null) {
	part_json_data[part_id-1].sequence.push(update_val);
    }
    else {
	part_json_data[part_id-1].sequence = [ update_val ];
    }
    NewSequence(part_id, update_val);
    let seq_add = document.getElementById('Part' + part_id + 'SeqAdd');
    seq_add.remove();

    let menu = document.createElement('div');
    menu.setAttribute('id', 'Part' + part_id + 'SeqAdd');
    let seq_id = document.getElementById('Part' + part_id + 'Sequence');
    seq_id.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddSequence(part_id);
	return false;
    };
    btn.textContent = 'Add sequence';
    menu.appendChild(btn);
}

function DrawMicrophone(context, x1, x2, yy, scale) {
    if( microphone_json_data == null) return;
    if( microphone_json_data.length == 0) return;

    for (let i = 0; i < microphone_json_data.length; i++) {
	const rx = microphone_json_data[i].orthogonal_position.x * scale;
	const ry = microphone_json_data[i].orthogonal_position.y * scale;
	const rz = microphone_json_data[i].orthogonal_position.z * scale;
    
	context.strokeStyle = "green";
	context.beginPath();
	context.arc(x1 + ry, yy-rz, 2, 0, 2*Math.PI, false);
	context.stroke();
	context.beginPath();
	context.arc(x2 + ry, yy+rx, 2, 0, 2*Math.PI, false);
	context.stroke();
    }
    
}

function AddMicrophone() {
    let new_id = 1;
    if( microphone_json_data != null) {
	new_id = microphone_json_data.length + 1;
    }
    console.log('AddMicrophone : new_id = ' + new_id);
    const update_val = { 'id': new_id, 'orthogonal_position':{ 'x':'0.0', 'y':'0.0', 'z':'0.0' }};
    if( microphone_json_data != null) {
	console.log(microphone_json_data);
	microphone_json_data.push(update_val);
    }
    else {
	microphone_json_data = [ update_val ];
    }
    NewMicrophone(update_val);
    microphoneAddMenu.remove();

    let menu = document.createElement('div');
    menu.setAttribute('id', 'microphoneAddMenu');
    microphone.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddMicrophone();
	return false;
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
    const update_val = { 'id': new_id, 'ir_fullpath': 'file name', 'amp':'1.0' };
    if( reverberation_json_data != null) {
	reverberation_json_data.push(update_val);
    }
    else {
	reverberation_json_data = [ update_val ];
    }
    NewReverberation(update_val);
    reverberationAddMenu.remove();

    let menu = document.createElement('div');
    menu.setAttribute('id', 'reverberationAddMenu');
    reverberation.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddReverberation();
	return false;
    };
    btn.textContent = 'Add reverberation';
    menu.appendChild(btn);
}

function NewCreator(data) {
    console.log('NewCreator');
    let ddd = document.createElement('div');
    creator.appendChild(ddd);

    let cc_id = AppendContent(ddd, 'Id', data.id);
    cc_id.setAttribute('id', 'CreatorId' + data.id);
    let cc_name = AppendContent(ddd, 'Name', data.name);
    let cc_afili = AppendContent(ddd, 'Affiliation', data.affiliation);
    let cc_email = AppendContent(ddd, 'E-mail', data.email);
    let cc_role = AppendContent(ddd, 'Role', data.role);
    let cc_lic = AppendContent(ddd, 'License', data.license);

    let menu = document.createElement('div');
    ddd.appendChild(menu)
    // Creator Edit Btn	    
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	console.log('Creator Edit Click');
	creatorDialog.style.display = 'block';
	creatorName.value = data.name;
	creatorAffiliation.value = data.affiliation;
	creatorEmail.value = data.email;
	creatorRole.value = data.role;
	creatorLicense.value = data.license;
	const cc_rect = cc_name.getBoundingClientRect();
	creatorDialog.style.top = (document.documentElement.scrollTop + cc_rect.y) + "px";
	displayMain(true);
	creatorOkBtn.onclick = function() {
	    console.log('Creator Edit OK Click');
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
	    creatorDialog.style.display = 'none';
	    displayMain(false);
//	    console.log('ID:' + data.id + ' : Name : ' + data.name + ' --> ' + creatorName.value);
//	    console.log('Creator OK in Edit Dialog');
	    return false;
	};
	creatorCancelBtn.onclick = function() {
	    creatorDialog.style.display = 'none';
	    displayMain(false);
	}
	return false;
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // Creator Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
//	console.log('Creator Delete Click');
	creator_json_data.splice(data.id-1, 1);
	for (let i = data.id-1; i < creator_json_data.length; i++) {
	    const jj = i+1;
	    const kk = i+2;
	    creator_json_data[i].id = jj;
	    let ppp = document.getElementById('CreatorId'+kk);
	    ppp.textContent = 'Id : ' + jj;
	    ppp.setAttribute('id', 'CreatorId' + jj);
	}
	ddd.remove();
	return false;
    };
    btn.textContent = 'Delete';
    menu.appendChild(btn);

    return false;
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
    let menu = document.createElement('div');
    menu.setAttribute('id', 'creatorAddMenu');
    creator.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddCreator();
	return false;
    };
//    console.log('Add creator 2');
    btn.textContent = 'Add creator';
    menu.appendChild(btn);

    return false;
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
    let menu = document.createElement('div');
    menu.setAttribute('id', 'Part' + data.id + 'FileAdd');
    li.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddFile(data.id);
	return false;
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
    menu = document.createElement('div');
    menu.setAttribute('id', 'Part' + data.id + 'SeqAdd');
    li.appendChild(menu)
    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddSequence(data.id);
	return false;
    };
    btn.textContent = 'Add sequence';
//    console.log('menu.id for appendChild = ' + menu.id);
    menu.appendChild(btn);

    // Part Edit Btn	    
    menu = document.createElement('div');
    ddd.appendChild(menu)

    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
//	console.log('Part Edit Click');
	partDialog.style.display = 'block';
	partName.value =  data.name;
	partAmp.value =  data.amp;
	const pp_rect = pp_name.getBoundingClientRect();
	partDialog.style.top = (document.documentElement.scrollTop + pp_rect.y) + "px";
	displayMain(true);
	partOkBtn.onclick = function() {
	    data.name = partName.value;
	    pp_name.textContent = 'Name : ' + partName.value;
	    data.amp = partAmp.value;
	    pp_amp.textContent = 'Amp : ' + partAmp.value;
	    partDialog.style.display = 'none';
//	    console.log('Part OK in Edit Dialog');
	    displayMain(false);
	    return false;
	};
	partCancelBtn.onclick = function() {
	    partDialog.style.display = 'none';
	    displayMain(false);
	}
	return false;
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // Part Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	part_json_data.splice(data.id-1, 1);
	for (let i = data.id-1; i < part_json_data.length; i++) {
	    const jj = i+1;
	    const kk = i+2;
	    part_json_data[i].id = jj;
	    let ppp = document.getElementById('PartId'+kk);
	    ppp.textContent = 'Id : ' + jj;
	    ppp.setAttribute('id', 'PartId' + jj);
	}
	ddd.remove();
	return false;
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
    let menu = document.createElement('div');
    menu.setAttribute('id', 'partAddMenu');
    part.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddPart();
	return false;
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
    let menu = document.createElement('div');
    ddd.appendChild(menu)
    // Mic Edit Btn	    
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
//	console.log('Mic Edit Click');
	micDialog.style.display = 'block';
	micPositionX.value =  data.orthogonal_position.x;
	micPositionY.value =  data.orthogonal_position.y;
	micPositionZ.value =  data.orthogonal_position.z;
	const pp_x_rect = pp_x.getBoundingClientRect();
	micDialog.style.top = (document.documentElement.scrollTop + pp_x_rect.y) + "px";
	displayMain(true);
	micOkBtn.onclick = function() {
	    data.orthogonal_position.x =  micPositionX.value;
	    data.orthogonal_position.y =  micPositionY.value;
	    data.orthogonal_position.z =  micPositionZ.value;
	    pp_x.textContent = 'Orthogonal_position.x : ' + micPositionX.value;
	    pp_y.textContent = 'Orthogonal_position.y : ' + micPositionY.value;
	    pp_z.textContent = 'Orthogonal_position.z : ' + micPositionZ.value;
	    micDialog.style.display = 'none';
	    displayMain(false);
	    DrawSpace();
	    return false;
	};
	micCancelBtn.onclick = function() {
	    micDialog.style.display = 'none';
	    displayMain(false);
	}
	return false;
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // Mic Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
//	console.log('Mic Delete Click');
	microphone_json_data.splice(data.id-1, 1);
	for (let i = data.id-1; i < microphone_json_data.length; i++) {
	    const jj = i+1;
	    const kk = i+2;
	    microphone_json_data[i].id = jj;
	    let ppp = document.getElementById('MicrophoneId'+kk);
	    ppp.textContent = 'Id : ' + jj;
	    ppp.setAttribute('id', 'MicrophoneId' + jj);
	}
	ddd.remove();
	return false;
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
    let menu = document.createElement('div');
    menu.setAttribute('id', 'microphoneAddMenu');
    microphone.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddMicrophone();
	return false;
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
    let menu = document.createElement('div');
    ddd.appendChild(menu)
    // Rev Edit Btn	    
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
//	console.log('Rev Edit Click');
	revDialog.style.display = 'block';
	revIRFN.value = data.ir_fullpath;
	revAmp.value = data.amp;
	const pp_ir_rect = pp_ir_fp.getBoundingClientRect();
	revDialog.style.top = (document.documentElement.scrollTop + pp_ir_rect.y) + "px";
	displayMain(true);
	revOkBtn.onclick = function() {
	    data.ir_fullpath = revIRFN.value;
	    data.amp = revAmp.value;
	    pp_ir_fp.textContent = 'ir_fullpath : ' + revIRFN.value;
	    pp_amp.textContent = 'Amp : ' + revAmp.value;
	    revDialog.style.display = 'none';
	    displayMain(false);
	    return false;
	};
	revCancelBtn.onclick = function() {
	    revDialog.style.display = 'none';
	    displayMain(false);
	}
	return false;
    };
    btn.textContent = 'Edit';
    menu.appendChild(btn);
    // Rev Delete Btn
    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
//	console.log('Rev Delete Click');
	reverberation_json_data.splice(data.id-1, 1);
	for (let i = data.id-1; i < reverberation_json_data.length; i++) {
	    const jj = i+1;
	    const kk = i+2;
	    reverberation_json_data[i].id = jj;
	    let ppp = document.getElementById('ReverberationId'+kk);
	    ppp.textContent = 'Id : ' + jj;
	    ppp.setAttribute('id', 'ReverberationId' + jj);
	}
	ddd.remove();
	return false;
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
    let menu = document.createElement('div');
    menu.setAttribute('id', 'reverberationAddMenu');
    reverberation.appendChild(menu)
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('class', 'mainButton');
    btn.onclick= function() {
	AddReverberation();
	return false;
    };
    btn.textContent = 'Add reverberation';
    menu.appendChild(btn);
}

function export2txt() {
    const a = document.createElement('a');
    const output = {
	'creator' : creator_json_data,
	'part' : part_json_data,
	'microphone' : microphone_json_data,
	'reverberation' : reverberation_json_data,
	'wavdata' : wavdata
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
    const files = loadFiles.files;
//    console.log(files);
    if (files.length <= 0) {
	return false;
    }

    let fr = new FileReader();

    fr.onload = function(e) {
	const result = JSON.parse(e.target.result);
//	console.log('clearData 1');
	clearData();
	NewCreators(result['creator']);
	NewParts(result['part']);
	NewMicrophones(result['microphone']);
	NewReverberations(result['reverberation']);
	NewWavData(result['wavdata']);
    }
    
    fr.readAsText(files.item(0));
    return false;
};

clearData();

function clearData() {
    NewCreators(null);
    NewParts(null);
    NewMicrophones(null);
    NewReverberations(null);

    if(!window.File){
	element_result.value = "File class is not supported.";
	return;
    }
    if(!window.FileReader){
	element_result.value = "FileReader class is not supported.";
	return;
    }
    element_result.value = "File class and FileReader class are supported.";
}

function ExecUpload() {
    const data = new FormData(document.getElementById('Part1wavfile1'));
    console.log("ExecUpload");
    fetch('upload.php', {
        method: 'POST',
        body: data,
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (data) {
	    element_result.value = data;
        })
        .catch(function (error) {
            element_result.value = error;
        })

}

function Byte2String(dataview, offset)
{
    const riff_1 = dataview.getUint8(offset);
    const riff_2 = dataview.getUint8(offset+1);
    const riff_3 = dataview.getUint8(offset+2);
    const riff_4 = dataview.getUint8(offset+3);
    return String.fromCharCode(riff_1, riff_2, riff_3, riff_4);
}

function WavFileRead(element_files, end_time_element, data_file) {
    // ------------------------------------------------------------
    // File オブジェクトを取得（HTML5 世代）
    // ------------------------------------------------------------
    // ファイルリストを取得
    const file_list = element_files;
    if(!file_list) return;

    // 0 番目の File オブジェクトを取得
    const file = file_list[0];
    if(!file) return;

    // ------------------------------------------------------------
    // FileReader オブジェクトを生成
    // ------------------------------------------------------------
    let file_reader = new FileReader();

    // ------------------------------------------------------------
    // テキストとして読み込む
    // ------------------------------------------------------------
    if(file.type.indexOf("text") == 0){

	// ------------------------------------------------------------
	// 読み込み成功時に実行されるイベント
	// ------------------------------------------------------------
	file_reader.onload = function(e){
	    element_result.value = file_reader.result;
	};
	// ------------------------------------------------------------
	// 読み込みを開始する（テキスト文字列を得る）
	// ------------------------------------------------------------
	file_reader.readAsText(file);

    // ------------------------------------------------------------
    // バイナリとして読み込む
    // ------------------------------------------------------------
    }else{
	// ------------------------------------------------------------
	// 読み込み成功時に実行されるイベント
	// ------------------------------------------------------------
	file_reader.onload = function(e){
	    let result = "";
	    const result_length = file_reader.result.byteLength ;

	    result += "Length :"  + result_length.toString() + "\n";
	    
	    const dataview = new DataView(file_reader.result);

	    if( Byte2String(dataview, 0) == 'RIFF' ) {
		result += "RIFF OK\n";
	    } else {
		result += "RIFF NG\n";
	    }
	    
	    const filesize = dataview.getUint32(4, true);
	    result += "File Size :"  + filesize.toString() + " Byte\n";

	    if( Byte2String(dataview, 8) == 'WAVE' ) {
		result += "WAVE OK\n";
	    } else {
		result += "WAVE NG\n";
	    }

	    let current_point = 12;
	    let header = '    ';
	    let datasize = 0;
	    let trial = 0;
	    do {
		current_point += datasize;
		header = Byte2String(dataview, current_point);
		current_point += 4;
		datasize = dataview.getUint32(current_point, true);
		current_point += 4;
		if( trial++ == 10)
		{
		    result += "FMT NG\n";
		    return;
		}
	    } while(header != 'fmt ');
	    let  format_id = 0;		// WAVファイルの形式
	    let  channel_num = 0;		// チャンネル数（1:モノラル，2:ステレオ）
	    let  sampling_rate = 0;		// サンプリング周波数（11025、22050、44100）
	    let  bytes_per_second = 0;	// １秒あたりの音声データのバイト数
	    let  bytes_per_sample = 0;	// １サンプルあたりのバイト数
	    let  bits_per_sample = 0;	// 量子化ビット数（8、16）
	    if( datasize >= 16 ) {
		result += "FMT SIZE OK\n";
		format_id = dataview.getUint16(current_point, true);
		result += "format_id = " + format_id.toString() + "\n";
		current_point += 2;
		channel_num = dataview.getUint16(current_point, true);
		result += "channel_num = " + channel_num.toString() + "\n";
		current_point += 2;
		sampling_rate = dataview.getUint32(current_point, true);
		result += "sampling_rate = " + sampling_rate.toString() + "\n";
		current_point += 4;
		bytes_per_second = dataview.getUint32(current_point, true);
		result += "bytes_per_second = " + bytes_per_second.toString() + "\n";
		current_point += 4;
		bytes_per_sample = dataview.getUint16(current_point, true);
		result += "bytes_per_sample = " + bytes_per_sample.toString() + "\n";
		current_point += 2;
		bits_per_sample = dataview.getUint16(current_point, true);
		result += "bits_per_sample = " + bits_per_sample.toString() + "\n";
		current_point += 2;
	    } else {
		result += "FMT SIZE NG\n";
		return;
	    }
	    datasize -= 16;
	    trial = 0;
	    do {
		current_point += datasize;
		header = Byte2String(dataview, current_point);
		current_point += 4;
		datasize = dataview.getUint32(current_point, true);
		current_point += 4;
		if( trial++ == 10)
		{
		    result += "DATA NG\n";
		    return;
		}
	    } while(header != 'data');
	    let data_head_point = current_point;
	    result += "data_head_point = " + data_head_point.toString() + "\n";

	    let ok = true;
	    if (format_id != 1 && format_id != 3) ok = false;
	    if (sampling_rate != 44100 && sampling_rate != 48000) ok = false;
	    if (bytes_per_second != sampling_rate*bytes_per_sample) ok = false;
	    if (bits_per_sample != bytes_per_sample * 8 / channel_num) ok = false;

	    stream_word_count = datasize / bytes_per_sample;
	    selectedEndtime = datasize / bytes_per_second;
	    data_file.end_time = selectedEndtime;
	    end_time_element.textContent = 'End time : ' + selectedEndtime.toFixed(1);

	    cursorLine.style.visibility = 'visible';

	    result += "stream_word_count = " + stream_word_count.toString() + "\n";
	    wavdata = new Array(stream_word_count);
	    
	    result += "ok = " + ok.toString() + "\n";
	    let file_format = 0;
	    if (ok)
	    {
		if (format_id == 1 && bits_per_sample == 16) file_format = 1;   // wav_int16;
		else if (format_id == 1 && bits_per_sample == 24) file_format = 2;  // wav_int24;
		else if (format_id == 3 && bits_per_sample == 32) file_format = 3;  // wav_float32;
		else ok = false;
	    }
	    result += "file_format = " + file_format.toString() + "\n";
	    element_result.value = result;
	    console.log(result);

	    if (file_format == 1)   // wav_int16
	    {
		const aa = 1.0/32767.0
		for (let i = 0; i < stream_word_count; i++) {
		    wavdata[i] = aa * dataview.getInt16(current_point, true);
		    current_point += 2;
		    if( i < 64) {
			result += wavdata[i].toString() + "\n";
		    }
		}		  
	    }
	    else if (file_format == 2)   // wav_int24
	    {
		const buffer = new ArrayBuffer(4);
		let dd = new DataView(buffer);
//		const max_point = dataview.byteLength;
//		console.log('Init: current_point = ' + current_point);
//		console.log('max dataview point = ' + max_point);
		const aa = 1.0/2147483647.0
		for (let i = 0; i < stream_word_count; i++) {
		    let d1 = dataview.getUint8(current_point++);
		    let d2 = dataview.getUint8(current_point++);
		    let d3 = dataview.getUint8(current_point++);
		    dd.setUint8(0, d3);
		    dd.setUint8(1, d2);
		    dd.setUint8(2, d1);
		    dd.setUint8(3, 0);
		    wavdata[i] = aa * dd.getInt32(0, false);
		    if( i < 64) {
			result += wavdata[i].toString() + "\n";
		    }
		}
	    }
	    else if (file_format == 3)   // wav_float32
	    {
		const buffer = new ArrayBuffer(4);
		let dd = new DataView(buffer);
		dd.setUint8(3, 0);
		for (let i = 0; i < stream_word_count; i++) {
		    let d1 = dataview.getUint32(current_point, true);
		    dd.setUint32(0, d1);
		    wavdata[i] = dd.getFloat32(0, false);
		    current_point += 4;
		    if( i < 64) {
			result += wavdata[i].toString() + "\n";
		    }
		}
	    }

	    element_result.value = result;
	    DrawWav();
	};

	// ------------------------------------------------------------
	// 読み込みを開始する（ArrayBuffer オブジェクトを得る）
	// ------------------------------------------------------------
	file_reader.readAsArrayBuffer(file);
    }
}

let time_seq_time = null;
let time_seq_position_radius = null;
let time_seq_position_azimuth = null;
let time_seq_position_elevation = null;

function MakeMotion(part_id) {
    const seq_data = part_json_data[part_id-1].sequence;
    const ed_time = part_json_data[part_id-1].file[0].end_time;
    const sampl_freq = 48000;
    const frame_size = 2048;
    const time_intvl = frame_size / sampl_freq;  //  s
    let current_state_no = 0;
    let state_changed = true;
    let current_position_radius;
    let current_position_azimuth;
    let current_position_elevation;
    let current_time = 0;
    let current_moving_time = 0;

    time_seq_time = new Array();
    time_seq_position_radius = new Array();
    time_seq_position_azimuth = new Array();
    time_seq_position_elevation = new Array();
    while( current_time < ed_time ) {
	if( (current_state_no+1) < seq_data.length && current_time >= seq_data[current_state_no+1].time ) {
            state_changed = (seq_data[current_state_no].motion.state != seq_data[current_state_no+1].motion.state);
            current_state_no = current_state_no + 1;
	}
	switch( seq_data[current_state_no].motion.state ) {
        case 'unmoving':    // need unmoving first
            current_position_radius = seq_data[current_state_no].motion.polar_position.radius;
            current_position_azimuth = seq_data[current_state_no].motion.polar_position.azimuth;
            current_position_elevation = seq_data[current_state_no].motion.polar_position.elevation;
	    break;
        case 'rotate':
            const horizontal_time = seq_data[current_state_no].motion.cycle.h;
            const vertical_time = seq_data[current_state_no].motion.cycle.v;
            if( horizontal_time != 0 ) {
                const horizontal_speed = 360*time_intvl/horizontal_time;
                let horizontal_position = current_position_azimuth + horizontal_speed;
                if( horizontal_position >= 360 ) {
                    horizontal_position = horizontal_position - 360;
                }
                current_position_azimuth = horizontal_position;
            }
            if( vertical_time != 0 ) {
                const vertical_speed = 360*time_intvl/vertical_time;
                let vertical_position = current_position_elevation + vertical_speed;
                if( vertical_position >= 360 ) {
                    vertical_position = vertical_position - 360;
                }
                current_position_elevation = vertical_position;
            }
	    break;
        case 'random':
            if(state_changed) {
                let random_current_time = 0;
	    } else {
                let random_current_time = random_current_time + time_intvl;
            }
            if( random_current_time >= ParseFloat(seq_data[current_state_no].motion.duration)) {
                current_position_azimuth = Math.randdom() * 360;
                current_position_elevation = Math.random() * 180 - 90;
                random_current_time = 0;
            }            
	    break;
        case 'moveto':
            if(state_changed) {
                current_moving_time = 0;
            }
            const t_radius = seq_data[current_state_no].motion.polar_position.radius;
            const t_azimuth = seq_data[current_state_no].motion.polar_position.azimuth;
            const t_elevation = seq_data[current_state_no].motion.polar_position.elevation;
	    const direction_radius = t_radius - current_position_radius;
	    const direction_azimuth = t_azimuth - current_position_azimuth;
	    const direction_elevation = t_elevation - current_position_elevation;
	    
            const remain_time = seq_data[current_state_no].duration - current_moving_time;
            const divide_count = Math.round(remain_time / time_intvl);
            if( divide_count >= 1 ) {
                current_position_radius = current_position_radius + direction_radius / divide_count;
                current_position_azimuth = current_position_azimuth + direction_azimuth / divide_count;
                current_position_elevation = current_position_elevation + direction_elevation / divide_count;
                current_moving_time = current_moving_time + time_intvl;
            }
	    break;
	}
	state_changed = false;
	time_seq_time.push(current_time);
	time_seq_position_radius.push(current_position_radius);
	time_seq_position_azimuth.push(current_position_azimuth);
	time_seq_position_elevation.push(current_position_elevation);
	current_time += time_intvl;
//	console.log(current_time + ":" + current_state_no + ":" + current_position_radius + ":" + current_position_azimuth + ":" + current_position_elevation);
    }
}

function DrawMotionStep(motion_time) {
    const sampl_freq = 48000;
    const frame_size = 2048;
    const m_point = parseInt(motion_time * sampl_freq / frame_size);
//    console.log("time=" + motion_time);
    if( time_seq_time == null ) return;
//    console.log("point=" + m_point + ", length=" + time_seq_time.length);
    if( m_point >= time_seq_time.length ) return;
    position_radius = time_seq_position_radius[m_point];
    position_azimuth = time_seq_position_azimuth[m_point] / 180.0 * Math.PI;
    position_elevation = time_seq_position_elevation[m_point] / 180.0 * Math.PI;
//    console.log(motion_time + ":" + position_radius + ":" + position_azimuth + ":" + position_elevation);
    DrawSpaceUnmoving();
}

function DrawMotion() {
    if( time_seq_time == null ) return;
    if( time_seq_time.length == 0 ) return;

    const element = document.getElementById( "positionCanvas" ) ;
    const ew = element.width;
    const eh = element.height;
    let context = element.getContext( "2d" ) ;

    const max_radius = 2.0;
    const h_scale_radius = eh / max_radius;
    const w_scale = ew / time_seq_time.length;
    
    context.clearRect(0,0,ew,eh);

    context.beginPath();
    context.moveTo(0, eh - time_seq_position_radius[0]*h_scale_radius);
    for(let i=1; i<time_seq_time.length; i++) {
	const xx = w_scale * i;
	const yy = eh - time_seq_position_radius[i]*h_scale_radius;
	context.lineTo( xx, yy );
    }
    context.lineTo( ew, eh - time_seq_position_radius[time_seq_time.length-1]*h_scale_radius );
    context.strokeStyle = "red";
    context.lineWidth = 1;
    context.stroke();

    const max_azimuth = 360.0;
    const h_scale_azimuth = eh / max_azimuth;
    
    context.beginPath();
    context.moveTo(0, eh - time_seq_position_azimuth[0]*h_scale_azimuth);
    for(let i=1; i<time_seq_time.length; i++) {
	const xx = w_scale * i;
	const yy = eh - time_seq_position_azimuth[i]*h_scale_azimuth;
	context.lineTo( xx, yy );
    }
    context.lineTo( ew, eh - time_seq_position_azimuth[time_seq_time.length-1]*h_scale_azimuth );
    context.strokeStyle = "green";
    context.lineWidth = 1;
    context.stroke();

    const max_elevation = 90.0;
    const h_scale_elevation = eh / max_elevation;
    
    context.beginPath();
    context.moveTo(0, eh/2 - time_seq_position_elevation[0]*h_scale_elevation);
    for(let i=1; i<time_seq_time.length; i++) {
	const xx = w_scale * i;
	const yy = eh/2 - time_seq_position_elevation[i]*h_scale_elevation;
	context.lineTo( xx, yy );
    }
    context.lineTo( ew, eh/2 - time_seq_position_elevation[time_seq_time.length-1]*h_scale_elevation );
    context.strokeStyle = "blue";
    context.lineWidth = 1;
    context.stroke();
}

function DrawWav() {
    if(stream_word_count < 2) return;
    
    const element = document.getElementById( "waveCanvas" ) ;
    const ew = element.width;
    const eh = element.height;
    let context = element.getContext( "2d" ) ;

    context.beginPath();
    const h_scale = eh / 2.0;
    const draw_count = stream_word_count;
    const w_scale = ew / draw_count;
    
    context.moveTo(0, eh/2 - wavdata[0]*h_scale);
    for(let i=1; i<draw_count; i++) {
	const xx = w_scale * i;
	const yy = eh/2 - wavdata[i]*h_scale;
	context.lineTo( xx, yy );
    }
    context.strokeStyle = "red";
    context.lineWidth = 1;
    context.stroke();
}

function play_btn_click() {
    play_btn_response.innerHTML = "0.0";
    let ff_audio = document.createElement('audio');
    const src = URL.createObjectURL(selectedFile);
    ff_audio.src = src;

    const event_list = [
        "abort","canplay","canplaythrough","durationchange","emptied",
        "error","loadeddata","loadedmetadata","loadstart",
        "pause","play","playing","progress","ratechange","seeking",
        "seeked","stalled","suspend","volumechange","waiting"
    ];

    const _leng = event_list.length;
    window.start_time = Date.now();

    for(let _i = 0; _i < _leng; _i++){
        ff_audio.addEventListener(event_list[_i],function(event){
            console.log(event.type+"\t:\t",Date.now() - window.start_time + "ms");
        });
    }
    const disp_scale = waveCanvas.clientWidth / selectedEndtime;

    ff_audio.addEventListener("timeupdate", function(event) {
	const point = parseInt(disp_scale * ff_audio.currentTime);
	cursorLine.style.left = point + "px";
	play_btn_response.innerHTML = ff_audio.currentTime;
	DrawMotionStep(ff_audio.currentTime);
    });
    ff_audio.addEventListener("ended", function(event) {
	cursorLine.style.left = "0px";
	play_btn_response.innerHTML = "0.0";
	DrawMotionStep(0);
    });

    ff_audio.play();
}

function NewWavData(data) {
    wavdata = data;
    stream_word_count = data.length;
    DrawWav();
}

function DrawSpace() {
    const element = document.getElementById( 'spaceCanvas' ) ;
    const context = element.getContext( '2d' ) ;
    const ew = element.width;
    const eh = element.height;
    console.log('ew = ' + ew + ', eh = ' + eh);

    context.clearRect(0,0,ew,eh);
    
    context.font = "18px serif";
    context.textAlign = "center";
    context.fillText("R = " + red_circle_distance.toString() + "m", ew * 0.5, eh -  30);

    context.beginPath();
    const x1 = ew * 0.25;
    const x2 = ew * 0.75;
    const rr = eh*0.4;
    context.strokeStyle = "red";
    context.lineWidth = 1;
    context.arc(x1, eh*0.5, rr, 0, 2 * Math.PI, false);
    context.stroke();
    context.beginPath();
    context.arc(x2, eh*0.5, rr, 0, 2 * Math.PI, false);
    context.stroke();

    const scale = 0.4;
    const x_width = img_side.naturalWidth*scale;
    const x_height = img_side.naturalHeight*scale;
    const y_width = img_above.naturalWidth*scale;
    const y_height = img_above.naturalHeight*scale;

    context.drawImage(img_side, x1-x_width/2, eh*0.5-x_height/2, x_width, x_height);
    context.drawImage(img_above, x2-y_width/2, eh*0.5-y_height/2, y_width, y_height);

    DrawMicrophone(context, x1, x2, eh*0.5, rr/red_circle_distance);
}

let position_radius = 0.0;
let position_azimuth = 0.0;
let position_elevation = 0.0;
let rotate_cycle_h = 0.0;
let rotate_cycle_v = 0.0;

function radiusChange() {
    const input_value = parseFloat(posRadiusInput.value);
    if( input_value != NaN ) {
	position_radius = input_value;
	DrawSpaceUnmoving();
    }
//    console.log("radiusChange =" + position_radius);
}

function azimuthChange() {
    const input_value = parseFloat(posAzimuthInput.value) / 180.0 * Math.PI;
    if( input_value != NaN ) {
	position_azimuth = input_value;
	DrawSpaceUnmoving();
    }
//    console.log("azimuthChange =" + position_azimuth);
}

function elevationChange() {
    const input_value = parseFloat(posElevationInput.value) / 180.0 * Math.PI;
    if( input_value != NaN ) {
	position_elevation = input_value;
	DrawSpaceUnmoving();
    }
//    console.log("elevationChange =" + position_elevation);
}

function rotateCycHChange() {
    const input_value = parseFloat(cycleHInput.value);
    if( input_value != NaN ) {
	rotate_cycle_h = input_value;
	console.log("rotate H change event : " + rotate_cycle_h);
	DrawSpaceRotate();
    }
}

function rotateCycVChange() {
    const input_value = parseFloat(cycleVInput.value);
    if( input_value != NaN ) {
	rotate_cycle_v = input_value;
	console.log("rotate V change event : " + rotate_cycle_v);
	DrawSpaceRotate();
    }
}

window.addEventListener( 'load', function() {
    const wv_cntner = document.getElementById( 'waveCanvas-container' );
    const sp_cntner = document.getElementById( 'spaceCanvas-container' );
    const pos_cntner = document.getElementById( 'positionCanvas-container' );
    const queue = null;
    const wait = 300;
 
    // ページ読込時にCanvasサイズ設定 
    setCanvasSize();

    // リサイズ時にCanvasサイズを再設定 
    window.addEventListener( 'resize', function() {
	clearTimeout( queue );
	queue = setTimeout(function() {
	    setCanvasSize();
	    DrawSpace();
	    DrawWav();
	    DrawMotion();
	}, wait );
    }, false );
 
    // Canvasサイズをコンテナの100%に 
    function setCanvasSize() {
	waveCanvas.width = wv_cntner.offsetWidth;
	waveCanvas.height = wv_cntner.offsetHeight;
	waveCanvasSequence.width = wv_cntner.offsetWidth;
	waveCanvasSequence.height = wv_cntner.offsetHeight;
	spaceCanvas.width = sp_cntner.offsetWidth;
	spaceCanvas.height = sp_cntner.offsetHeight;
	spaceCanvasSequence.width = sp_cntner.offsetWidth;
	spaceCanvasSequence.height = sp_cntner.offsetHeight;
	positionCanvas.width = pos_cntner.offsetWidth;
	positionCanvas.height = pos_cntner.offsetHeight;
	positionCanvasSequence.width = pos_cntner.offsetWidth;
	positionCanvasSequence.height = pos_cntner.offsetHeight;
    }

    DrawSpace();

}, false );

function DrawSequence(part_id, seq_id, draw_flag) {
    const element = document.getElementById( 'waveCanvasSequence' ) ;
    const context = element.getContext( '2d' ) ;
    const ew = element.width;
    const eh = element.height;
    context.clearRect(0,0,ew,eh);

    const element1 = document.getElementById( 'positionCanvasSequence' ) ;
    const context1 = element1.getContext( '2d' ) ;
    const ew1 = element1.width;
    const eh1 = element1.height;
    context1.clearRect(0,0,ew1,eh1);

    if(draw_flag == false) return;

    const d_seq = part_json_data[part_id-1].sequence;
    const leng = d_seq.length;
    const ed_time = part_json_data[part_id-1].file[0].end_time;
    let seq_ed_time = ed_time;
    const seq_st_time = d_seq[seq_id-1].time;
    if( seq_id < leng) {
	seq_ed_time = d_seq[seq_id].time;
    }
    
//    console.log("ew = " + ew + ", seq_st_time = " + seq_st_time + ", seq_ed_time = " + seq_ed_time + ", ed_time = " + ed_time);
    const x_from = ew * seq_st_time / ed_time;
    const x_to = ew * seq_ed_time / ed_time;
//    console.log("x_from = " + x_from + ", x_to = " + x_to);
    context.fillStyle="red";
    context.fillRect(x_from,0,x_to,eh);
    context1.fillStyle="red";
    context1.fillRect(x_from,0,x_to,eh1);

    const mot = d_seq[seq_id-1].motion;
    if( mot.state == 'unmoving' )
    {
	position_radius = mot.polar_position.radius;
	position_azimuth = mot.polar_position.azimuth / 180.0 * Math.PI;
	position_elevation = mot.polar_position.elevation / 180.0 * Math.PI;
	DrawSpaceUnmoving();
    }
    else if( mot.state == 'rotate' )
    {
	rotate_cycle_h = mot.cycle.h;
	rotate_cycle_v = mot.cycle.v;
	DrawSpaceRotate();
    }
}

function DrawSpaceUnmoving() {
    if( position_radius == 0.0 ) return;

    const element = document.getElementById( 'spaceCanvasSequence' ) ;
    const context = element.getContext( '2d' ) ;
    const ew = element.width;
    const eh = element.height;
    const x1 = ew * 0.25;
    const x2 = ew * 0.75;
    const rr = eh* 0.4 * position_radius / red_circle_distance;
    context.clearRect(0,0,ew,eh);

    context.strokeStyle = "blue";
    context.lineWidth = 1;

    context.beginPath();
    const rd = rr * Math.cos(position_elevation);
    const elv_x = rd * Math.cos(position_azimuth);
    const elv_y = -rr * Math.sin(position_elevation);
//    console.log("elv_x = " + elv_x + ", elv_y = " + elv_y);
    context.arc(x1 + elv_x, eh*0.5+elv_y, rr*0.1, 0, 2 * Math.PI, false);
    context.stroke();
    context.beginPath();
    const azi_x = elv_x;
    const azi_y = rd * Math.sin(position_azimuth);
//    console.log("azi_x = " + azi_x + ", azi_y = " + azi_y);
    context.arc(x2 + azi_x, eh*0.5 + azi_y, rr*0.1, 0, 2 * Math.PI, false);
    context.stroke();
}

function DrawSpaceRotate() {
    const element = document.getElementById( 'spaceCanvasSequence' ) ;
    const context = element.getContext( '2d' ) ;
    const ew = element.width;
    const eh = element.height;
    const x1 = ew * 0.25;
    const x2 = ew * 0.75;
    const rr = eh*0.4;
    const yy = eh*0.5;

    context.clearRect(0,0,ew,eh);
    if( rotate_cycle_v < 0 ) {
	drawArrow(context, x1, yy, rr, -30.0, 30.0, 5.0, 5.0, 5.0);
    } else if( rotate_cycle_v > 0 ) {
	drawArrow(context, x1, yy, rr, 30.0, -30.0, 5.0, 5.0, -5.0);
    }
    if( rotate_cycle_h < 0 ) {
	drawArrow(context, x2, yy, rr, 30.0, -30.0, 5.0, 5.0, -5.0);
    } else if( rotate_cycle_h > 0 ) {
	drawArrow(context, x2, yy, rr, -30.0, 30.0, 5.0, 5.0, 5.0);
    }
}

function drawArrow(context, xx, yy, rr, theta_fr, theta_to, rr_w, ar_w, theta_ar) {
    console.log("rotate_cycle_h = " + rotate_cycle_h + ", rotate_cycle_v = " + rotate_cycle_v);

    const rr1i = rr - rr_w;
    const theta1 = theta_fr / 180 * Math.PI;
    const a1i_x = xx + rr1i * Math.cos(theta1);
    const a1i_y = yy + rr1i * Math.sin(theta1);
    const rr1o = rr + rr_w;
    const a1o_x = xx + rr1o * Math.cos(theta1);
    const a1o_y = yy + rr1o * Math.sin(theta1);
    const theta2 = theta_to / 180 * Math.PI;

//    console.log("xx = " + xx + ", yy = " + yy + ", rr1i = " + rr1i);
//    console.log("theta1 = " + theta1 + ", theta2 = " + theta2);
    
    context.beginPath();
    context.arc(xx, yy, rr1i, theta2, theta1, theta1 < theta2);
//    context.moveTo(a1i_x, a1i_y);
    context.lineTo(a1o_x, a1o_y);
    context.arc(xx, yy, rr1o, theta1, theta2, theta1 > theta2);
    const rr1o_a = rr1o + ar_w;
    const a2o_x = xx + rr1o_a * Math.cos(theta2);
    const a2o_y = yy + rr1o_a * Math.sin(theta2);
    context.lineTo(a2o_x, a2o_y);

    const theta3 = (theta_to + theta_ar) / 180 * Math.PI;
    const a3o_x = xx + rr * Math.cos(theta3);
    const a3o_y = yy + rr * Math.sin(theta3);
    context.lineTo(a3o_x, a3o_y);
    
    const rr1i_a = rr1i - ar_w;
    const a2i_x = xx + rr1i_a * Math.cos(theta2);
    const a2i_y = yy + rr1i_a * Math.sin(theta2);
    context.lineTo(a2i_x, a2i_y);

    const a3i_x = xx + rr1i * Math.cos(theta2);
    const a3i_y = yy + rr1i * Math.sin(theta2);
    context.lineTo(a3i_x, a3i_y);

    context.stroke();
}
