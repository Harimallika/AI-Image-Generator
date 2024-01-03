const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;

const UpdateImageCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject, index ) =>{
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);

        }
    });
}


const geneerateAiImages = async(userPrompt , userImgQuantity)=>{
    console.log("Starting geneerateAiImages...");
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "post",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n:parseInt(userImgQuantity),
                size:"512x512",
                response_format: "b64_json"
            })
        });

        if(!response.ok) throw new Error("Failed to generate images! please try again.");

        const{data } = await response.json();
        UpdateImageCard([...data]);
     }catch(error){
        alert(error.message);
    }finally {
        isImageGenerating = false;

        console.log("Finished geneerateAiImages.");
    }
}

const handleFormSubmission = (e) =>{
    console.log("Handling form submission...");

    e.preventDefault();

    if(isImageGenerating) return;
    isImageGenerating = true;

     const userPrompt = e.srcElement[0].value;
     const userImgQuantity = e.srcElement[1].value;

    //  console.log(userPrompt , userImgQuantity);

    const imgCardMarkup = Array.from({length: userImgQuantity}, ()=>
    `<div class="img-card loading">
    <img src="loader.svg" alt="image">
    <a href="#" class="download-btn">
        <img src="download.svg" alt="download icon">
    </a>
</div>`
    ).join("");
    // console.log(imgCardMarkup);
    imageGallery.innerHTML = imgCardMarkup;
    geneerateAiImages(userPrompt, userImgQuantity);

    console.log("Form submission handled.");
}

generateForm.addEventListener("submit", handleFormSubmission);