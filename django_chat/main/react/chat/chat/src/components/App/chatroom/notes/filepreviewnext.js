const FilePreview = props => {
  const [fileSending, setFilesending] = useState(false);
  const setupFileSize = () => {
    try {
      if (!fileSize) {
        return props.socket.bufferedAmount;
      } else {
        return 0;
      }
    } catch {
      console.log('in filesize');
      return 0;
    }
  };
    const [fileSize, setFileSize] = useState(0);
    useEffect(()=>{

        var size=props.socket.bufferedAmount;

        setInterval(()=>{console.log(size)},3000)

    },[])
  const setuptransferredSize = () => {
    try {
      if (fileSending && fileSize) {
        return (props.socket.bufferedAmount * 100) / fileSize;
      }
      return 0;
    } catch {
      console.log('transer');
    }
  };
    const [transferredSize, setTransferredSize] = useState(setuptransferredSize());


/*    useEffect(()=>{
        if(fileSending && props.socket.bufferedAmount==0){
            setFilesending(false);
            setTransferredSize(0);
            setFileSize(0);
        }
    })*/

