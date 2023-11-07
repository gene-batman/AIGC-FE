import { Box, CircularProgress, Divider, ImageList, ImageListItem, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Stack, TextField, Theme } from '@mui/material';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Text2Img() {
  const [checkpoints, setCheckpoints] = useState<{ id: number; name: string }[]>([])
  const [modelId, setModelId] = useState<string>('')
  const [payload, setPayload] = useState({
    prompt: '',
    negative_prompt: '',
    width: 512,
    height: 512,
    seed: -1,
    batch_size: 1,
  });
  const [submiting, setSubmiting] = useState<boolean>(false)
  const [task, setTask] = useState<any>(null)

  const imageList = task?.generations?.results?.map((item: any) => {
    return {
      url: `/sdapi/task/read?name=${item.image}`,
      ...item
    }
  }) ?? []

  const forms = [
    {
      mode: 'text',
      name: 'prompt',
      lable: 'Prompt',
      value: payload.prompt,
    },
    {
      mode: 'text',
      name: 'negative_prompt',
      lable: 'Negative Prompt',
      value: payload.negative_prompt,
    },
    {
      mode: 'number',
      name: 'width',
      lable: 'Width',
      value: payload.width,
    },
    {
      mode: 'number',
      name: 'height',
      lable: 'Height',
      value: payload.height,
    },
    {
      mode: 'number',
      name: 'seed',
      lable: 'Seed',
      value: payload.seed,
    },
    {
      mode: 'number',
      name: 'batch_size',
      lable: 'Batch Size',
      value: payload.batch_size,
    },
  ]

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    setModelId(value);
  };

  const taskQuery = async (taskId: string) => {
    return await fetch(`/sdapi/task/query?taskId=${taskId}`)
      .then(res => res.json())
      .then(res => {
        return res
      })
  }

  const loopTaskQuery = async (taskId: string) => {
    const res = await taskQuery(taskId)
    setTask(res.data)
    if (res.data.status <= 1) {
      setTimeout(() => {
        loopTaskQuery(taskId)
      }, 2000);
      return
    }
    setSubmiting(false)
  }

  const handleSubmit = async () => {
    setSubmiting(true)
    const res = await fetch('/sdapi/task/text2Image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelId,
        ...payload,
      }),
    }).then(res => res.json())
    loopTaskQuery(res.data.taskId)
  }

  useEffect(() => {
    fetch('/sdapi/model/list')
      .then(res => res.json())
      .then(res => {
        setCheckpoints(res.data.models)
        setModelId(String(res.data.models[0].id))
      })
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <Paper className='flex-1' sx={{ padding: '0 24px', width: '100%', height: '100%', overflow: 'auto' }}>
        <Box sx={{ padding: '24px 0' }}>
          <p className='mb-3 text-[18px]'>选择模型：</p>
          <Select
            size='small'
            value={String(modelId)}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {
              checkpoints.map((item) => (
                <MenuItem
                  key={String(item.id)}
                  value={String(item.id)}
                >
                  {item.name}
                </MenuItem>
              ))
            }
          </Select>
        </Box>
        <Divider />
        <Box sx={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {
            forms.map((item, idx) => {
              return (
                <Box key={idx} display={'flex'} flexDirection='column'>
                  <p className='mb-3 text-[14px]'>{ item.lable }:</p>
                  <TextField
                    size='small'
                    fullWidth={item.mode === 'text'}
                    multiline={item.mode === 'text'}
                    maxRows={3}
                    placeholder={`请输入${item.name}`}
                    value={item.value}
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        [item.name]: e.target.value,
                      })
                    }}
                  />
                </Box>
              )
            })
          }
        </Box>
        <Divider />
        <Stack sx={{ padding: '24px 0' }} direction="row" spacing={2}>
          <LoadingButton loading={submiting} variant="outlined" onClick={handleSubmit}>
            Submit
          </LoadingButton>
        </Stack>
      </Paper>
      <Box sx={{ padding: '24px 24px' }}>
        <p className='mb-4 text-[20px] text-center'>绘图预览</p>
        {
          submiting && (
            <Box sx={{ padding: '32px 0', textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          )
        }
        <ImageList sx={{ width: 300 }} cols={2} rowHeight={164}>
          {imageList.map((item: any, idx: number) => (
            <ImageListItem key={idx}>
              <img
                src={`${item.url}`}
                alt={item.seed}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  )
}