import http, { BACKEND_URL } from './httpservices';

const pdfService = {
    downloadPDF:function(webURL,paciente){
        const apiURL=`${BACKEND_URL}/api/pdf/getpdf`;
        console.log(webURL);
        console.log(paciente);
        return http.get(apiURL,{
            responseType:'blob',
            params: { webURL: webURL, paciente:paciente },
            headers:{
                'Accept':'application/pdf',
                
            }
        })
    },

    sendUsingSendgrid(to, subject, content) {
        const apiUrl = `${BACKEND_URL}/pdf/enviar-email`;
        http.post(
            apiUrl,
            {to, subject, content}
        );
    },
};

export default pdfService;
;