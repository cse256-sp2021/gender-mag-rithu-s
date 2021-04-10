// ---- Define your dialogs  and panels here ----
    permtext = 'testing';
    $('#sidepanel').prepend(permtext);

    new_perm = define_new_effective_permissions('newpermid', true, null);
    $('#sidepanel').append(new_perm);

    new_user = define_new_user_select_field('newpermid', 'Select User to Check Permissions', function(selected_user){$('#newpermid').attr('username', selected_user)});
    $('#sidepanel').append(new_user);

    $('#newpermid').attr('filepath', '/C/presentation_documents/important_file.txt');

    new_dialog = define_new_dialog('newpermid', 'Permissions Explanation'); 

$('.viewpermbutton').click(function(){
    console.log('test'); 
    path = $(this).getAttribute('path');
    $('#newpermid').attr('filepath', path);
    console.log(path);
    console.log(permtext);
    
    permtext.text('Permissions for: ' + path);
});

$('.perm_info').click(function(){
    new_dialog.dialog('open'); 

    new_filepath = $('#newpermid').attr('filepath'); 
    new_username = $('#newpermid').attr('username');
    new_perm_name = $(this).attr('permission_name'); 

    console.log(new_filepath);
    console.log(new_username); 
    console.log(new_perm_name); 

    file_obj_var = path_to_file[new_filepath]; 
    username_obj_var = all_users[new_username]; 

    explanation = allow_user_action(file_obj_var, username_obj_var, new_perm_name, explain_why = true); 
    explained_text = get_explanation_text(explanation); 

    new_dialog.text(explained_text); 

})

// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    // if(file_obj.is_folder) {
    //     let folder_elem = $(`<div class='folder' id="${file_hash}_div">
    //         <h3 id="${file_hash}_header">
    //             <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
    //             <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
    //                 <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/>  
    //                 See Permissions
    //             </button>
    //         </h3>
    //     </div>`)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    Edit Permissions
                </button>
                <button class="ui-button ui-widget ui-corner-all viewpermbutton" path="${file_hash}" id="${file_hash}_viewpermbutton"> 
                    View Permissions
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        // return $(`<div class='file'  id="${file_hash}_div">
        //     <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
        //     <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
        //         <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
        //         See Permissions
        //     </button>
        // </div>`)
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                Edit Permissions
            </button>
            <button class="ui-button ui-widget ui-corner-all viewpermbutton" path="${file_hash}" id="${file_hash}_viewpermbutton"> 
                View Permissions
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?

// $('explained_text').accordion({
//     collapsible: true,
//     heightStyle: 'content'
// })

// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});

// $('.viewpermbutton').click( function( f ) {
//     // Set the path and open dialog:
//     let path = f.currentTarget.getAttribute('path');
//     $('#newpermid').attr('filepath', path);
//     console.log(path);
//     console.log(permtext);
//     //open_permissions_dialog(path)
//     permtext.text('Permissions for: ' + path);

//     // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
//     f.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
//     // Emit a click for logging purposes:
//    // emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
// });


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 