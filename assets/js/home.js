
// click event on button
$('#input-container button').click(function(){
    let userName = $('input').val();
    if(userName === ""){
        alert('Enter username !!');
        return;
    }
    $.ajax({
        url: `https://api.github.com/users/${userName}`,
        method: 'GET',
        beforeSend: function(xhr){
            $('#user-details-container').empty();
            let loader = loaderContainer();
            $('body').append(loader);
        },
        success: function(data1){
            let repoLink = data1.repos_url;
            $.ajax({
                url: repoLink ,
                method: 'GET',
                success: function(data){
                    $('#user-details-container').empty();
                    let container = userContainer(data1);
                    $('#user-details-container').append(container);
                    $('#user-details-container').append($(`<div id="user-repo-container"></div>`));
                    for(let i = 0; i < data.length; i++){
                        $('#user-repo-container').append(userRepo(data[i], i));
                        let languageUrl = data[i].languages_url;
                        $.ajax({
                            url: languageUrl,
                            method: 'GET',
                            success: function(data3){
                                for(language in data3){
                                    $(` .user-repo-${i} .lang-btn-container`).append($(`<button>${language}</button>`));
                                }
                            },complete: function(xhr){
                                $('#loader-container').remove();
                            }
                        });
                    }
                },complete: function(xhr){
                    $('#user-input').val("");
                    $('#loader-container').remove();
                }
            });
        },complete: function(xhr){
            $('#loader-container').remove();
        }
    }).catch((err) => {
        alert(err.responseJSON.message);
        $('#user-input').val("");
        $('#loader-container').remove();
    });
});

let loaderContainer = function(){
    return $(`<div id="loader-container">
                <img src="../images/loader.gif" alt="">
            </div>`);
}

let userRepo = function(data, i){
    return $(`<div class="user-repo-${i} user-repo">
                <div class="repo-details">
                    <h2 class="repo-name">${data.name}</h2>
                    <p class="repo-desc">${data.description}</p>
                </div>
                <div class="lang-btn-container">

                </div>
            </div>`)
}

let userContainer = function(data){
    return $(`<div id="user-details">
                <div id="imgAndName-container">
                    <div id="img-container">
                        <img src=${data.avatar_url} alt="">
                    </div>
                    <div id="name-container">
                        <h1 id="user-name">${data.name}</h1>
                        <p id="user-bio">${data.bio}</p>
                        <p id="user-location">${data.location}</p>
                        <p id="twitter-handle">Twitter: <a href="https://twitter.com/${data.twitter_username}">https://twitter.com/${data.twitter_username}</a></p>
                    </div>
                </div>
                <div id="user-github-link">
                    <p><a href="https://github.com/${data.login}">https://github.com/${data.login}</a></p>
                </div>
            </div>`);
}