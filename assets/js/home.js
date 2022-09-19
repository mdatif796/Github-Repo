$('button').click(function(){
    let userName = $('input').val();
    if(userName == ""){
        alert('Enter username !!');
        return;
    }
    $.ajax({
        url: `https://api.github.com/users/${userName}`,
        method: 'GET',
        beforeSend: function(){
            $('#loader').attr('src', 'https://i.gifer.com/VAyR.gif');
        },
        success: function(data, xhr){
            console.log(xhr.status);
        },complete: function(xhr){
            console.log(xhr.status);
            $('#loader').hide();
        }
    }).catch((err) => {
        // console.log('User not found');
    });
});