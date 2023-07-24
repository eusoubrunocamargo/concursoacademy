import { supabase } from "../../supabase";
import { useAuth } from "./useAuth";
import { useAlert } from "./useAlert";
import { useCallback, useMemo, useState } from "react";

export const useStudySession = () => {

    const { user } = useAuth();
    const { showAlert } = useAlert();
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [loading, setLoading] = useState(false);

    const saveStudySession = async (subject_id, topic_id, session) => {
        const { error } = await supabase
            .from('user_studytime')
            .insert([
                {
                    user_id: user.id,
                    subject_id: subject_id,
                    topic_id: topic_id,
                    seconds: session,
                }
            ]);

        if (error) {
            console.error(error);
            showAlert('Não foi possível salvar a sessão!', 'fail');
            return;
        }

        showAlert('Sessão salva com sucesso!', 'success');
        return true;
    }

    const getStudySession = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('user_studytime')
            .select('seconds')
            .eq('user_id', user.id)

        if (error) {
            console.error(error);
            return;
        }

        const totalSeconds = data.reduce((acc, curr) => {
            return acc + curr.seconds;
        }, 0);

        setTotalSeconds(totalSeconds);
        setLoading(false);

    }, [user]);

    useMemo(() => {
        getStudySession();
    }, [getStudySession]);

    return {
        saveStudySession,
        getStudySession,
        totalSeconds,
        loading,
    };
};


