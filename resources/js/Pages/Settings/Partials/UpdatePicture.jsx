import Loader from "@/Components/Loader";
import { notify_success } from "@/Components/Notify";
import { show_errors } from "@/global/Functions";
import { getCroppedImg } from "@/utils/cropUtils";
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";

export default function UpdatePicture({ user }) {
    const [displayPicture, setDisplayPicture] = useState(user?.picture);
    const [selectedFile, setSelectedFile] = useState(null);

    const { data, setData, post, processing } = useForm({
        picture: null,
    });

    const handleChange = (event) => {
        if (!event.target.files[0]) return;
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        post(route("update.picture"), {
            onSuccess: () => {
                notify_success("Picture updated");
                location.reload();
            },
            onError: (errors) => {
                show_errors(errors);
            },
        });
    };

    return (
        <>
            <section className="edit_profile_picture">
                <h2 className="settings_title">Edit picture</h2>
                <div className="picture_preview">
                    <img src={displayPicture} alt="profile picture" />
                </div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label htmlFor="picture_input">
                        <button type="button" className="select_picture">
                            Select picture
                        </button>
                        <input
                            id="picture_input"
                            type="file"
                            accept=".jpg, .jpeg, .png"
                            name="picture"
                            required
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" className="save_btn">
                        Upload picture
                    </button>
                </form>
            </section>

            {selectedFile && (
                <CropImageModal
                    selectedFileState={[selectedFile, setSelectedFile]}
                    setData={setData}
                    setDisplayPicture={setDisplayPicture}
                />
            )}

            {
                processing && <Loader />
            }
        </>
    );
}

function CropImageModal({ selectedFileState, setDisplayPicture, setData }) {
    const [selectedFile, setSelectedFile] = selectedFileState;

    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    useEffect(() => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
            setImageSrc(reader.result);
        };
    }, []);

    const onSetData = async () => {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

        const fileImage = blobToFile(croppedImage, "croppedImage.jpg");
        setData("picture", fileImage);
        setDisplayPicture(URL.createObjectURL(croppedImage));
        setSelectedFile(null);
    };

    const blobToFile = (blob, fileName) => {
        const file = new File([blob], fileName, {
            type: blob.type,
            lastModified: Date.now(),
        });
        return file;
    };

    return (
        <section className="profile_uploader_section">
            <div className="profile_uploader container content_center y">
                <div className="crop_container">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
                <div className="set_cropped_image">
                    <button onClick={onSetData} className="save_btn" type="button">Save</button>
                </div>
            </div>
        </section>
    );
}
